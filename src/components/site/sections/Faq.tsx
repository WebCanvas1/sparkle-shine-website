import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { useFaqs } from "@/lib/content";

export function FaqSection() {
  const { data: faqs } = useFaqs();

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto w-full max-w-3xl px-4">
        <SectionHeading
          eyebrow="FAQ"
          title="Everything you might be wondering"
          description="Still have a question? Call us — a real person answers."
        />

        <Reveal className="mt-12">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="rounded-2xl border border-border bg-card px-6 shadow-soft"
              >
                <AccordionTrigger className="py-5 text-left text-base font-bold text-navy hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
