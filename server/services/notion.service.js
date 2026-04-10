import { Client } from '@notionhq/client';
import logger from '../config/logger.js';

export const addCandidateToNotion = async (candidate) => {
  try {
    if (!process.env.NOTION_API_KEY || !process.env.NOTION_HR_DATABASE_ID) {
      logger.warn('⚠️ Notion credentials missing for HR. Skipping Notion sync.');
      return false;
    }

    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    const databaseId = process.env.NOTION_HR_DATABASE_ID;

    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        "Name": { title: [{ text: { content: String(candidate.name) } }] },
        "Email": { email: candidate.email },
        "WhatsApp": { phone_number: String(candidate.whatsapp) },
        "Role": { select: { name: String(candidate.role) } },
        "Portfolio": { url: candidate.portfolioUrl || null },
        "Resume": { url: candidate.resumeUrl || null },
        "Experience": { rich_text: [{ text: { content: String(candidate.message || "N/A").substring(0, 2000) } }] }
      }
    });

    logger.info(`✅ Candidate ${candidate.name} synced to Notion successfully!`);
    return response.id;
  } catch (error) {
    logger.error(`🔴 Notion API Error (HR): ${error.message}`);
    return false;
  }
};


export const addLeadToNotion = async (lead, amount, promoDetails) => {
  try {
    const dbId = process.env.NOTION_LEADS_DATABASE_ID || process.env.NOTION_DATABASE_ID;

    if (!process.env.NOTION_API_KEY || !dbId) {
      logger.warn('⚠️ Notion credentials missing for Leads. Skipping Notion sync.');
      return false;
    }

    const notion = new Client({ auth: process.env.NOTION_API_KEY });

    const properties = {
      "Name": { title: [{ text: { content: `${lead.name} - ${lead.businessName || 'New Project'}` } }] },
      "Status": { select: { name: "New Lead" } },
      "Service": { select: { name: lead.service || "General Inquiry" } },
      "Email": { email: lead.email },
      "WhatsApp": { phone_number: String(lead.whatsapp) },
      "Project Value": { number: Math.round(Number(amount || 0)) },
      "Payment Status": { select: { name: "Unpaid" } },
      "Website URL": { url: lead.websiteUrl ? String(lead.websiteUrl) : null },
      "Project Brief": { rich_text: [{ text: { content: String(lead.message || "No brief provided").substring(0, 2000) } }] },
      "Lead Type": { select: { name: "Inbox" } },
      "Portal Access": { checkbox: false },
      "Date & Time": { 
        date: { 
          start: new Date(lead.createdAt || Date.now()).toISOString() 
        } 
      }
    };

    if (promoDetails) {
      properties["Promo Details"] = { 
        rich_text: [{ text: { content: String(promoDetails).substring(0, 2000) } }] 
      };
    }

    const response = await notion.pages.create({
      parent: { database_id: dbId },
      properties: properties
    });

    logger.info(`✅ Lead ${lead.name} synced to Notion CRM successfully!`);
    return response.id;
  } catch (error) {
    logger.error(`🔴 Notion API Error (Leads): ${error.message}`);
    return false;
  }
};


export const updateNotionPortalAccess = async (notionPageId, accessStatus) => {
  try {
    if (!process.env.NOTION_API_KEY || !notionPageId) return false;
    
    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    
    await notion.pages.update({
      page_id: notionPageId,
      archived: !accessStatus, 
      properties: {
        "Portal Access": { checkbox: accessStatus }
      }
    });

    logger.info(`✅ Notion Portal Access updated to ${accessStatus}. Page archived: ${!accessStatus}`);
    return true;
  } catch (error) {
    logger.error(`🔴 Notion Update Error: ${error.message}`);
    return false;
  }
};

export const updateNotionLeadStatus = async (notionPageId, newStatus) => {
  try {
    if (!process.env.NOTION_API_KEY || !notionPageId) return false;
    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    
    await notion.pages.update({
      page_id: notionPageId,
      properties: {
        "Status": { select: { name: newStatus } }
      }
    });

    logger.info(`✅ Notion Status updated to ${newStatus}`);
    return true;
  } catch (error) {
    logger.error(`🔴 Notion Status Update Error: ${error.message}`);
    return false;
  }
};