// app/service-center/page.tsx
import InfoPageLayout from "../components/InfoPageLayout";
import Link from "next/link";
import { Wrench, Settings, Truck, UserCheck, ShieldCheck } from "lucide-react";

export default function ServiceCenterPage() {
  return (
    <InfoPageLayout title="Service & Support Center">
      <h2>Our Commitment to You</h2>
      <p>
        At Radhika Machineries, our relationship with our clients extends far
        beyond the sale. We understand that your productivity depends on the
        reliability and performance of our machines. Our dedicated Service
        Center is committed to providing comprehensive after-sales support to
        ensure your operations run smoothly and efficiently, minimizing downtime
        and maximizing your return on investment.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10 not-prose">
        <ServiceItem
          icon={<Truck size={30} />}
          title="Installation & Commissioning"
        />
        <ServiceItem
          icon={<Wrench size={30} />}
          title="Breakdown & Repair Support"
        />
        <ServiceItem
          icon={<ShieldCheck size={30} />}
          title="Annual Maintenance Contracts (AMC)"
        />
        <ServiceItem
          icon={<Settings size={30} />}
          title="Genuine Spare Parts"
        />
        <ServiceItem icon={<UserCheck size={30} />} title="Operator Training" />
      </div>

      <h2>Request Service</h2>
      <p>
        Need assistance? Our team of expert technicians is ready to help. Please
        contact us with your machine&apos;s model number and a description of
        your issue for the fastest possible response.
      </p>
      <div className="mt-6">
        <Link
          href="/contact"
          className="bg-brand-green-dark text-white font-bold py-3 px-6 rounded-md hover:bg-brand-green-light transition-colors no-underline"
        >
          Contact Our Service Team
        </Link>
      </div>
    </InfoPageLayout>
  );
}

const ServiceItem = ({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) => (
  <div className="flex items-center gap-4 bg-light-gray p-4 rounded-lg">
    <div className="text-brand-green-dark">{icon}</div>
    <h3 className="text-lg font-semibold text-dark-gray m-0">{title}</h3>
  </div>
);
