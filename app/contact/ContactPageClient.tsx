"use client"

import type React from "react"
import { useState } from "react"
import { Phone, Mail, MapPin, Clock, Check, Loader2, ChevronDown } from "lucide-react"
import Link from "next/link"
import type { CMSData } from "@/lib/cms"

const faqs = [
  {
    q: "What are your opening hours?",
    a: "Monday to Friday, 10:00 AM – 10:00 PM. Weekends (Saturday & Sunday), 11:00 AM – 11:00 PM.",
  },
  {
    q: "Do you offer delivery?",
    a: "Yes — we deliver throughout Freetown. Times vary depending on your location and current order volume.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Cash on delivery and mobile money. Provide the transaction ID at checkout for mobile money payments.",
  },
  {
    q: "Can I customise my order?",
    a: "Yes. Add special instructions when placing your order, or call us at 074 762 243 for specific requests.",
  },
  {
    q: "How do I track my order?",
    a: "Contact us directly via phone or WhatsApp after placing your order for delivery status updates.",
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-stone-100 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <span className="text-sm font-semibold text-stone-800">{q}</span>
        <ChevronDown
          className={`w-4 h-4 text-stone-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <p className="text-stone-500 text-sm leading-relaxed pb-5">{a}</p>}
    </div>
  )
}

export default function ContactPageClient({ cms }: { cms: CMSData }) {
  const WHATSAPP_NUMBER = cms.contact_phone_intl
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("submitting")
    const text = [
      `*Message from LUXE FOOD website*`,
      ``,
      `*Name:* ${formState.name}`,
      `*Phone:* ${formState.phone}`,
      `*Subject:* ${formState.subject}`,
      `*Message:* ${formState.message}`,
    ].join("\n")

    setTimeout(() => {
      setStatus("success")
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank")
    }, 600)
  }

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: "#FFFDF8" }}>
      <main className="container mx-auto px-6 py-24 lg:py-32">
        <div className="max-w-5xl mx-auto">

          {/* Page header */}
          <div className="grid lg:grid-cols-2 gap-8 items-end mb-16 lg:mb-20">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-yellow-700 mb-4">Contact</p>
              <h1 className="text-4xl lg:text-5xl font-bold text-stone-900 leading-[1.1]">
                Get in touch.
              </h1>
            </div>
            <div>
              <p className="text-base lg:text-lg text-stone-500 leading-relaxed">
                Questions, custom orders, or just want to say hello — we&apos;re always happy to hear from you.
              </p>
            </div>
          </div>

          {/* Info + Form */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-20">

            {/* Left: contact info */}
            <div className="space-y-10">
              <div className="space-y-6">
                <Link href={`tel:${cms.contact_phone_intl}`} className="flex items-start gap-4 group">
                  <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-4 h-4 text-stone-500" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 mb-0.5">Phone</p>
                    <p className="text-stone-900 font-semibold text-sm group-hover:text-yellow-700 transition-colors">
                      {cms.contact_phone}
                    </p>
                  </div>
                </Link>

                <Link
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-stone-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 mb-0.5">WhatsApp</p>
                    <p className="text-stone-900 font-semibold text-sm group-hover:text-green-600 transition-colors">
                      Chat with us
                    </p>
                  </div>
                </Link>

                <Link href={`mailto:${cms.contact_email}`} className="flex items-start gap-4 group">
                  <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-4 h-4 text-stone-500" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 mb-0.5">Email</p>
                    <p className="text-stone-900 font-semibold text-sm group-hover:text-yellow-700 transition-colors">
                      {cms.contact_email}
                    </p>
                  </div>
                </Link>

                <Link
                  href={`https://maps.google.com/?q=${encodeURIComponent(cms.contact_address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-stone-500" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 mb-0.5">Location</p>
                    <p className="text-stone-900 font-semibold text-sm group-hover:text-yellow-700 transition-colors">
                      {cms.contact_address}
                    </p>
                  </div>
                </Link>
              </div>

              {/* Hours */}
              <div className="border-t border-stone-100 pt-8">
                <p className="text-xs font-bold tracking-[0.15em] uppercase text-stone-400 mb-4 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Opening Hours
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">{cms.hours_weekday_label}</span>
                    <span className="text-stone-800 font-medium">{cms.hours_weekday_times}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">{cms.hours_weekend_label}</span>
                    <span className="text-stone-800 font-medium">{cms.hours_weekend_times}</span>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="bg-stone-100 rounded-xl overflow-hidden h-52 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-6 h-6 text-stone-400 mx-auto mb-2" />
                  <p className="text-stone-400 text-sm">{cms.contact_address}</p>
                </div>
              </div>
            </div>

            {/* Right: form */}
            <div>
              {status === "success" ? (
                <div className="flex flex-col items-center justify-center text-center py-16">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 mb-1">Message sent</h3>
                  <p className="text-stone-500 text-sm mb-6">
                    We&apos;ve opened WhatsApp with your message. We&apos;ll reply shortly.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="text-sm font-medium text-stone-900 underline underline-offset-4"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1.5">
                      Your Name *
                    </label>
                    <input
                      name="name"
                      required
                      value={formState.name}
                      onChange={handleChange}
                      placeholder="Full name"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl h-12 px-4 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/40 focus:border-yellow-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1.5">
                      Phone *
                    </label>
                    <input
                      name="phone"
                      required
                      value={formState.phone}
                      onChange={handleChange}
                      placeholder="e.g., 076 123 456"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl h-12 px-4 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/40 focus:border-yellow-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1.5">
                      Subject *
                    </label>
                    <input
                      name="subject"
                      required
                      value={formState.subject}
                      onChange={handleChange}
                      placeholder="What can we help you with?"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl h-12 px-4 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/40 focus:border-yellow-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1.5">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formState.message}
                      onChange={handleChange}
                      placeholder="Tell us more..."
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/40 focus:border-yellow-500 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full bg-stone-900 hover:bg-stone-800 text-white py-3.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send via WhatsApp"
                    )}
                  </button>

                  <p className="text-center text-stone-400 text-xs">
                    Opens WhatsApp with your message pre-filled.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* FAQ */}
          <div className="border-t border-stone-100 pt-16">
            <div className="grid lg:grid-cols-2 gap-8 items-end mb-10">
              <div>
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-yellow-700 mb-3">FAQ</p>
                <h2 className="text-2xl lg:text-3xl font-bold text-stone-900 leading-tight">
                  Common questions.
                </h2>
              </div>
              <div>
                <p className="text-stone-500 text-sm leading-relaxed">
                  Everything you need to know about ordering and delivery.
                </p>
              </div>
            </div>
            <div className="max-w-2xl">
              {faqs.map((faq, i) => (
                <FAQItem key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
