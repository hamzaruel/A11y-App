import { randomUUID } from "crypto";
import type { ScanResult, AccessibilityIssue, IssueType, Severity } from "@shared/schema";

interface ParsedElement {
  tag: string;
  attributes: Record<string, string>;
  textContent: string;
  outerHTML: string;
}

async function fetchWebsiteContent(url: string): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "AccessiScan/1.0 (Web Accessibility Checker)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
      throw new Error("The URL does not point to an HTML page");
    }

    return await response.text();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout: The website took too long to respond");
    }
    throw error;
  }
}

function parseHTML(html: string): {
  images: ParsedElement[];
  links: ParsedElement[];
  buttons: ParsedElement[];
  headings: ParsedElement[];
  interactiveElements: ParsedElement[];
} {
  const images: ParsedElement[] = [];
  const links: ParsedElement[] = [];
  const buttons: ParsedElement[] = [];
  const headings: ParsedElement[] = [];
  const interactiveElements: ParsedElement[] = [];

  const imgRegex = /<img([^>]*)(?:\/>|>(?:<\/img>)?)/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const attrs = parseAttributes(match[1]);
    images.push({
      tag: "img",
      attributes: attrs,
      textContent: "",
      outerHTML: truncateHTML(match[0]),
    });
  }

  const linkRegex = /<a([^>]*)>([\s\S]*?)<\/a>/gi;
  while ((match = linkRegex.exec(html)) !== null) {
    const attrs = parseAttributes(match[1]);
    const textContent = stripTags(match[2]).trim();
    links.push({
      tag: "a",
      attributes: attrs,
      textContent,
      outerHTML: truncateHTML(match[0]),
    });
  }

  const buttonRegex = /<button([^>]*)>([\s\S]*?)<\/button>/gi;
  while ((match = buttonRegex.exec(html)) !== null) {
    const attrs = parseAttributes(match[1]);
    const textContent = stripTags(match[2]).trim();
    buttons.push({
      tag: "button",
      attributes: attrs,
      textContent,
      outerHTML: truncateHTML(match[0]),
    });
  }

  const inputButtonRegex = /<input([^>]*type\s*=\s*["'](?:button|submit|reset)["'][^>]*)(?:\/>|>)/gi;
  while ((match = inputButtonRegex.exec(html)) !== null) {
    const attrs = parseAttributes(match[1]);
    buttons.push({
      tag: "input",
      attributes: attrs,
      textContent: attrs.value || "",
      outerHTML: truncateHTML(match[0]),
    });
  }

  const headingRegex = /<(h[1-6])([^>]*)>([\s\S]*?)<\/\1>/gi;
  while ((match = headingRegex.exec(html)) !== null) {
    const attrs = parseAttributes(match[2]);
    const textContent = stripTags(match[3]).trim();
    headings.push({
      tag: match[1].toLowerCase(),
      attributes: attrs,
      textContent,
      outerHTML: truncateHTML(match[0]),
    });
  }

  const inputRegex = /<input([^>]*)(?:\/>|>)/gi;
  while ((match = inputRegex.exec(html)) !== null) {
    const attrs = parseAttributes(match[1]);
    const type = attrs.type || "text";
    if (!["hidden", "button", "submit", "reset"].includes(type)) {
      interactiveElements.push({
        tag: "input",
        attributes: attrs,
        textContent: "",
        outerHTML: truncateHTML(match[0]),
      });
    }
  }

  const selectRegex = /<select([^>]*)>[\s\S]*?<\/select>/gi;
  while ((match = selectRegex.exec(html)) !== null) {
    const attrs = parseAttributes(match[1]);
    interactiveElements.push({
      tag: "select",
      attributes: attrs,
      textContent: "",
      outerHTML: truncateHTML(match[0]),
    });
  }

  const textareaRegex = /<textarea([^>]*)>[\s\S]*?<\/textarea>/gi;
  while ((match = textareaRegex.exec(html)) !== null) {
    const attrs = parseAttributes(match[1]);
    interactiveElements.push({
      tag: "textarea",
      attributes: attrs,
      textContent: "",
      outerHTML: truncateHTML(match[0]),
    });
  }

  const iconButtonRegex = /<(?:button|a)([^>]*)>\s*<(?:svg|i|span[^>]*class="[^"]*icon[^"]*")[^>]*>[\s\S]*?<\/(?:svg|i|span)>\s*<\/(?:button|a)>/gi;
  while ((match = iconButtonRegex.exec(html)) !== null) {
    const attrs = parseAttributes(match[1]);
    const textContent = stripTags(match[0]).trim();
    if (!textContent && !attrs["aria-label"] && !attrs["aria-labelledby"] && !attrs.title) {
      interactiveElements.push({
        tag: "icon-button",
        attributes: attrs,
        textContent: "",
        outerHTML: truncateHTML(match[0]),
      });
    }
  }

  return { images, links, buttons, headings, interactiveElements };
}

function parseAttributes(attrString: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const attrRegex = /(\w+(?:-\w+)*)\s*=\s*["']([^"']*)["']/g;
  let match;
  while ((match = attrRegex.exec(attrString)) !== null) {
    attrs[match[1].toLowerCase()] = match[2];
  }
  const boolAttrRegex = /\s(\w+)(?=\s|$|>)/g;
  while ((match = boolAttrRegex.exec(attrString)) !== null) {
    if (!attrs[match[1].toLowerCase()]) {
      attrs[match[1].toLowerCase()] = "";
    }
  }
  return attrs;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
}

function truncateHTML(html: string, maxLength: number = 150): string {
  if (html.length <= maxLength) return html;
  return html.substring(0, maxLength) + "...";
}

function createIssue(
  type: IssueType,
  severity: Severity,
  element: string,
  description: string,
  wcagReference: string,
  codeSnippet: string
): AccessibilityIssue {
  return {
    id: randomUUID(),
    type,
    severity,
    element,
    description,
    wcagReference,
    codeSnippet,
  };
}

function checkMissingAltText(images: ParsedElement[]): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  
  for (const img of images) {
    const alt = img.attributes.alt;
    const role = img.attributes.role;
    
    if (role === "presentation" || role === "none") {
      continue;
    }
    
    if (alt === undefined) {
      issues.push(createIssue(
        "missing_alt_text",
        "error",
        "<img>",
        `Image is missing alt attribute. Screen readers cannot describe this image to users.`,
        "1.1.1 Non-text Content",
        img.outerHTML
      ));
    }
  }
  
  return issues;
}

function checkEmptyLinks(links: ParsedElement[]): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  
  for (const link of links) {
    const hasText = link.textContent.length > 0;
    const hasAriaLabel = !!link.attributes["aria-label"];
    const hasAriaLabelledby = !!link.attributes["aria-labelledby"];
    const hasTitle = !!link.attributes.title;
    const hasImg = link.outerHTML.includes("<img");
    
    if (!hasText && !hasAriaLabel && !hasAriaLabelledby && !hasTitle && !hasImg) {
      issues.push(createIssue(
        "empty_link",
        "error",
        "<a>",
        `Link has no accessible text. Screen readers cannot convey the link's purpose.`,
        "2.4.4 Link Purpose",
        link.outerHTML
      ));
    }
  }
  
  return issues;
}

function checkMissingAriaLabels(buttons: ParsedElement[], interactiveElements: ParsedElement[]): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  
  for (const button of buttons) {
    const hasText = button.textContent.length > 0;
    const hasAriaLabel = !!button.attributes["aria-label"];
    const hasAriaLabelledby = !!button.attributes["aria-labelledby"];
    const hasTitle = !!button.attributes.title;
    const hasValue = !!button.attributes.value;
    
    if (!hasText && !hasAriaLabel && !hasAriaLabelledby && !hasTitle && !hasValue) {
      issues.push(createIssue(
        "missing_aria_label",
        "error",
        `<${button.tag}>`,
        `Button has no accessible name. Screen readers cannot identify this button's purpose.`,
        "4.1.2 Name, Role, Value",
        button.outerHTML
      ));
    }
  }
  
  for (const element of interactiveElements) {
    if (element.tag === "icon-button") {
      issues.push(createIssue(
        "missing_aria_label",
        "error",
        "<icon-button>",
        `Icon-only button lacks accessible text. Add aria-label or visually hidden text.`,
        "4.1.2 Name, Role, Value",
        element.outerHTML
      ));
    }
    
    if (["input", "select", "textarea"].includes(element.tag)) {
      const hasId = !!element.attributes.id;
      const hasAriaLabel = !!element.attributes["aria-label"];
      const hasAriaLabelledby = !!element.attributes["aria-labelledby"];
      const hasPlaceholder = !!element.attributes.placeholder;
      const hasTitle = !!element.attributes.title;
      
      if (!hasId && !hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
        if (!hasPlaceholder) {
          issues.push(createIssue(
            "missing_aria_label",
            "warning",
            `<${element.tag}>`,
            `Form control has no associated label. Users may not understand its purpose.`,
            "1.3.1 Info and Relationships",
            element.outerHTML
          ));
        }
      }
    }
  }
  
  return issues;
}

function checkHeadingHierarchy(headings: ParsedElement[]): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  
  if (headings.length === 0) {
    return issues;
  }
  
  const firstHeading = headings[0];
  if (firstHeading.tag !== "h1") {
    issues.push(createIssue(
      "heading_hierarchy",
      "warning",
      `<${firstHeading.tag}>`,
      `Page should start with an h1 heading. Found ${firstHeading.tag.toUpperCase()} instead.`,
      "1.3.1 Info and Relationships",
      firstHeading.outerHTML
    ));
  }
  
  const h1Count = headings.filter(h => h.tag === "h1").length;
  if (h1Count > 1) {
    issues.push(createIssue(
      "heading_hierarchy",
      "warning",
      "<h1>",
      `Page has ${h1Count} h1 headings. Consider using only one main h1 per page.`,
      "1.3.1 Info and Relationships",
      `Multiple h1 elements found (${h1Count} total)`
    ));
  }
  
  for (let i = 1; i < headings.length; i++) {
    const currentLevel = parseInt(headings[i].tag[1]);
    const prevLevel = parseInt(headings[i - 1].tag[1]);
    
    if (currentLevel > prevLevel + 1) {
      issues.push(createIssue(
        "heading_hierarchy",
        "warning",
        `<${headings[i].tag}>`,
        `Heading level skips from h${prevLevel} to h${currentLevel}. This creates confusion for screen reader users.`,
        "1.3.1 Info and Relationships",
        headings[i].outerHTML
      ));
    }
  }
  
  return issues;
}

function checkKeyboardAccessibility(interactiveElements: ParsedElement[]): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  
  for (const element of interactiveElements) {
    const tabindex = element.attributes.tabindex;
    
    if (tabindex !== undefined) {
      const tabindexValue = parseInt(tabindex, 10);
      if (tabindexValue > 0) {
        issues.push(createIssue(
          "keyboard_inaccessible",
          "warning",
          `<${element.tag}>`,
          `Element has positive tabindex (${tabindexValue}). This disrupts natural tab order.`,
          "2.4.3 Focus Order",
          element.outerHTML
        ));
      }
    }
  }
  
  return issues;
}

export async function scanWebsite(url: string): Promise<ScanResult> {
  const html = await fetchWebsiteContent(url);
  const { images, links, buttons, headings, interactiveElements } = parseHTML(html);
  
  const allIssues: AccessibilityIssue[] = [
    ...checkMissingAltText(images),
    ...checkEmptyLinks(links),
    ...checkMissingAriaLabels(buttons, interactiveElements),
    ...checkHeadingHierarchy(headings),
    ...checkKeyboardAccessibility(interactiveElements),
  ];
  
  const errorCount = allIssues.filter(i => i.severity === "error").length;
  const warningCount = allIssues.filter(i => i.severity === "warning").length;
  
  const checksPerformed = 5;
  const categoriesWithIssues = new Set(allIssues.map(i => i.type)).size;
  const passedChecks = checksPerformed - categoriesWithIssues;
  
  return {
    url,
    scannedAt: new Date().toISOString(),
    totalIssues: allIssues.length,
    errorCount,
    warningCount,
    passedChecks: Math.max(0, passedChecks),
    issues: allIssues,
  };
}
