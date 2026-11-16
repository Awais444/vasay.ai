import { blockContent, callout, codeBlock, ctaBlock, faqBlock, table } from "./blocks";
import { author, category, post, seo } from "./documents";
import { siteSchemaTypes } from "./site";

export const schemaTypes = [
  ...siteSchemaTypes,
  post, author, category, seo, blockContent, callout, table, codeBlock, faqBlock, ctaBlock,
];
