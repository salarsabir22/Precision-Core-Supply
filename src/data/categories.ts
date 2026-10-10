import type { Category } from "@/lib/types";

/**
 * Category tree. Products reference a *leaf* category slug.
 * Nest by setting `parent` to another category's slug.
 */
export const categories: Category[] = [
  {
    slug: "electrical-test",
    name: "Electrical Test & Measurement",
    shortName: "Electrical test",
    description: "Clamp meters, insulation testers, thermal imagers and oscilloscopes.",
  },
  {
    slug: "process-instrumentation",
    name: "Process Instrumentation, Flow, Pressure, Level & Fluid Handling",
    shortName: "Process & flow",
    description: "Pressure, flow, level and fluid-handling instruments.",
  },
  {
    slug: "industrial-automation",
    name: "Industrial Automation, Control Logic & Motor Protection",
    shortName: "Automation",
    description: "PLCs, contactors, drives, sensors and motor protection.",
  },
  {
    slug: "ppe-safety",
    name: "PPE, Occupational Safety & Gas Detection",
    shortName: "PPE & safety",
    description: "Respirators, protective clothing, fall protection and gas detectors.",
  },
  {
    slug: "condition-monitoring",
    name: "Turbomachinery Condition Monitoring & Vibration",
    shortName: "Condition monitoring",
    description: "Machinery-protection racks, modules and proximity probes.",
  },
  {
    slug: "calibrators",
    name: "Metrology-Grade Pressure & Temperature Calibrators",
    shortName: "Calibrators",
    description: "Handheld pressure calibrators and field metrology dry-wells.",
  },
  {
    slug: "rf-laboratory",
    name: "High-Bandwidth RF, Microwave & Laboratory Electronics",
    shortName: "RF & laboratory",
    description: "Handheld microwave analyzers, oscilloscopes and source measure units.",
  },
  {
    slug: "mass-flow",
    name: "Coriolis Flowmeters & Mass Flow Controllers",
    shortName: "Mass flow",
    description: "Coriolis flowmeters and mass flow controllers.",
  },
  {
    slug: "analytical-sensors",
    name: "Environmental & Trace Analytical Sensors",
    shortName: "Analytical sensors",
    description: "Dew point, moisture and combustion transmitters.",
  },
  {
    slug: "remote-inspection",
    name: "Transportable Multi-Threat Safety & Remote Inspection",
    shortName: "Remote inspection",
    description: "Area monitors and industrial video borescopes.",
  },
];
