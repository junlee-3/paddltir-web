import { z } from "zod";

/**
 * Minimal stub of @ato-mcp/shared for the privacy page.
 * Only exports UserFactsSchema so schema keys can be listed; not for validation.
 */
export const UserFactsSchema = z
  .object({
    given_name: z.string().min(1),
    state: z.enum(["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"]),
    residency_status: z.enum([
      "resident",
      "non_resident",
      "temporary_resident",
      "working_holiday_maker",
    ]),
    has_abn: z.boolean(),
    abn: z.string().optional(),
    business_structure: z.enum([
      "sole_trader",
      "partnership",
      "company",
      "trust",
      "none",
    ]),
    business_name: z.string().optional(),
    industry_code: z.string().optional(),
    occupation: z.string().optional(),
    gst_registered: z.boolean(),
    gst_period: z.enum(["monthly", "quarterly", "annual", "n/a"]),
    payg_instalments: z.boolean(),
    fbt_payer: z.boolean(),
    has_spouse: z.boolean(),
    dependants: z.number().int().min(0).max(20),
    hecs_help_debt: z.boolean(),
    private_health_insurance: z.boolean(),
    has_investment_property: z.boolean(),
    has_shares_or_managed_funds: z.boolean(),
    has_crypto: z.boolean(),
    super_fund_type: z.enum(["industry", "retail", "smsf", "unsure", "none"]),
    current_fy: z.string(),
    prior_fy_lodged: z.boolean(),
    accepted_disclaimer_at: z.string(),
    facts_updated_at: z.string(),
    schema_version: z.literal(1),
  })
  .superRefine(() => {});
