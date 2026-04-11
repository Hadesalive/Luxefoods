import { cache } from "react"
import { createClient } from "@supabase/supabase-js"

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { global: { fetch: (url, opts) => fetch(url, { ...opts, cache: "no-store" }) } }
  )
}

export interface CMSData {
  brand_name: string
  brand_tagline: string
  brand_location: string
  hero_headline: string
  hero_tagline_mobile: string
  hero_tagline_desktop: string
  hero_cta_primary: string
  hero_cta_secondary: string
  about_heading: string
  about_subheading: string
  about_mission: string
  about_story: string
  contact_phone: string
  contact_phone_intl: string
  contact_email: string
  contact_address: string
  hours_weekday_label: string
  hours_weekday_times: string
  hours_weekend_label: string
  hours_weekend_times: string
  delivery_heading: string
  delivery_description: string
  delivery_cta_heading: string
  delivery_cta_body: string
  services_heading: string
  services_description: string
  services_page_heading: string
  services_page_body: string
  footer_description: string
  footer_copyright: string
  social_facebook: string
  social_instagram: string
}

const DEFAULTS: CMSData = {
  brand_name: "LUXE FOOD",
  brand_tagline: "The Bites Of Delight",
  brand_location: "Freetown · Sierra Leone",
  hero_headline: "LUXE FOOD",
  hero_tagline_mobile: "Homestyle Sierra Leone cooking — made fresh, delivered fast.",
  hero_tagline_desktop:
    "Homestyle Sierra Leone cooking — jollof rice, grilled chicken, and more. Made fresh, delivered fast.",
  hero_cta_primary: "Order Now",
  hero_cta_secondary: "Our Services",
  about_heading: "About LUXE FOOD",
  about_subheading: "Your trusted source for quality meals and catering in Freetown",
  about_mission:
    "To provide our community with quality meals, local dishes, and international cuisine, delivered with care to your doorstep. We believe everyone deserves exceptional food made with the finest ingredients.",
  about_story:
    "LUXE FOOD started with a simple dream: to bring the best of local and international cuisine to the people of Freetown. We've become a beloved part of the community, serving quality meals, delicious local dishes, and offering professional catering services for events of all sizes. Our commitment to quality and customer satisfaction has made us a trusted name in food delivery and catering across Freetown, Sierra Leone.",
  contact_phone: "076 825 325",
  contact_phone_intl: "23276825325",
  contact_email: "info@luxefood.com",
  contact_address: "Freetown, Sierra Leone",
  hours_weekday_label: "Monday – Friday",
  hours_weekday_times: "10:00 AM – 10:00 PM",
  hours_weekend_label: "Saturday – Sunday",
  hours_weekend_times: "11:00 AM – 11:00 PM",
  delivery_heading: "We bring it straight to you.",
  delivery_description:
    "Homestyle cooking delivered across Freetown. Call us or order online — we'll handle the rest.",
  delivery_cta_heading: "Order Online for Faster Service",
  delivery_cta_body:
    "Skip the wait and get exclusive deals when you order through our website!",
  services_heading: "Catering for every occasion.",
  services_description:
    "From weddings to birthdays, we bring exceptional food and service to your most important moments.",
  services_page_heading: "Our Services",
  services_page_body:
    "From intimate dinners to grand celebrations, we bring exceptional food and impeccable service to every occasion.",
  footer_description:
    "Bringing you delicious meals with quality ingredients and exceptional taste.",
  footer_copyright: `© ${new Date().getFullYear()} LUXE FOOD. All rights reserved.`,
  social_facebook: "https://www.facebook.com/luxefood",
  social_instagram: "https://www.instagram.com/luxefood",
}

export const getCMS = cache(async (): Promise<CMSData> => {
  try {
    const { data } = await db().from("content_blocks").select("key, value")
    if (!data?.length) return DEFAULTS

    const map: Record<string, string> = {}
    for (const block of data as { key: string; value: string | null }[]) {
      if (block.value) map[block.key] = block.value
    }

    return {
      brand_name:          map.brand_name          ?? DEFAULTS.brand_name,
      brand_tagline:       map.brand_tagline        ?? DEFAULTS.brand_tagline,
      brand_location:      map.brand_location       ?? DEFAULTS.brand_location,
      hero_headline:       map.hero_headline        ?? DEFAULTS.hero_headline,
      hero_tagline_mobile: map.hero_tagline_mobile  ?? DEFAULTS.hero_tagline_mobile,
      hero_tagline_desktop:map.hero_tagline_desktop ?? DEFAULTS.hero_tagline_desktop,
      hero_cta_primary:    map.hero_cta_primary     ?? DEFAULTS.hero_cta_primary,
      hero_cta_secondary:  map.hero_cta_secondary   ?? DEFAULTS.hero_cta_secondary,
      about_heading:       map.about_heading        ?? DEFAULTS.about_heading,
      about_subheading:    map.about_subheading     ?? DEFAULTS.about_subheading,
      about_mission:       map.about_mission        ?? DEFAULTS.about_mission,
      about_story:         map.about_story          ?? DEFAULTS.about_story,
      contact_phone:       map.contact_phone        ?? DEFAULTS.contact_phone,
      contact_phone_intl:  map.contact_phone_intl   ?? DEFAULTS.contact_phone_intl,
      contact_email:       map.contact_email        ?? DEFAULTS.contact_email,
      contact_address:     map.contact_address      ?? DEFAULTS.contact_address,
      hours_weekday_label: map.hours_weekday_label  ?? DEFAULTS.hours_weekday_label,
      hours_weekday_times: map.hours_weekday_times  ?? DEFAULTS.hours_weekday_times,
      hours_weekend_label: map.hours_weekend_label  ?? DEFAULTS.hours_weekend_label,
      hours_weekend_times: map.hours_weekend_times  ?? DEFAULTS.hours_weekend_times,
      delivery_heading:    map.delivery_heading     ?? DEFAULTS.delivery_heading,
      delivery_description:map.delivery_description ?? DEFAULTS.delivery_description,
      delivery_cta_heading:map.delivery_cta_heading ?? DEFAULTS.delivery_cta_heading,
      delivery_cta_body:   map.delivery_cta_body    ?? DEFAULTS.delivery_cta_body,
      services_heading:    map.services_heading     ?? DEFAULTS.services_heading,
      services_description:map.services_description ?? DEFAULTS.services_description,
      services_page_heading:map.services_page_heading ?? DEFAULTS.services_page_heading,
      services_page_body:  map.services_page_body   ?? DEFAULTS.services_page_body,
      footer_description:  map.footer_description   ?? DEFAULTS.footer_description,
      footer_copyright:    map.footer_copyright     ?? DEFAULTS.footer_copyright,
      social_facebook:     map.social_facebook      ?? DEFAULTS.social_facebook,
      social_instagram:    map.social_instagram     ?? DEFAULTS.social_instagram,
    }
  } catch {
    return DEFAULTS
  }
})
