// app/faq/page.tsx
import InfoPageLayout from "../components/InfoPageLayout";
import FaqAccordion from "../components/FaqAccordion";

export default function FaqPage() {
  const faqItems = [
    {
      question: "How can I get a quotation for a machine?",
      answer:
        "You can request a quote by filling out the form on our Contact Us page, emailing us directly at rmt.jodhpur@gmail.com, or calling our sales team. We recommend providing as much detail as possible about your requirements.",
    },
    {
      question: "Do you offer customization for your machines?",
      answer:
        "Yes, we understand that every production facility has unique needs. We offer a range of customization options. Please discuss your specific requirements with our technical team to explore the possibilities.",
    },
    {
      question: "What kind of warranty do you provide on your machinery?",
      answer:
        "All our new machines come with a standard 12-month warranty covering manufacturing defects. Detailed terms of the warranty are provided in the final purchase agreement.",
    },
    {
      question: "Do you provide installation and operator training?",
      answer:
        "Absolutely. Our service includes on-site installation and commissioning by our expert engineers. We also provide comprehensive training for your operators to ensure they can run the machinery safely and efficiently.",
    },
    {
      question: "How can I order genuine spare parts?",
      answer:
        "To order spare parts, please contact our Service Center with your machine's model number and the required part details. Using genuine Radhika Machineries parts ensures the best performance and longevity of your equipment.",
    },
    {
      question: "Do you ship your machinery internationally?",
      answer:
        "Yes, we serve clients globally. We have extensive experience in handling international logistics and can arrange for shipping to most major ports worldwide.",
    },
  ];

  return (
    <InfoPageLayout title="Frequently Asked Questions">
      <FaqAccordion items={faqItems} />
    </InfoPageLayout>
  );
}
