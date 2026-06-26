/**
 * i3 SOLUTION GALAXY — DATA / MODEL LAYER
 * ------------------------------------------------------------------
 * The "database" for the visualization: focus areas (pillars), solutions,
 * verticals and pain points, plus the derived graph model (nodes, edges,
 * layout) and small pure helpers that operate on that data.
 *
 * GROUNDING: solutions, focus areas, verticals are verbatim from i3international.com;
 * pain→solution links are grounded against i3's industry pages. Pain-point names
 * are our framing.
 *
 * UI rendering lives in i3-solution-universe.jsx, which imports from here.
 */

export const TYPE = { CORE: "core", PILLAR: "pillar", SOLUTION: "solution", PAIN: "pain" };

export const PILLARS = [
  { id: "P1", label: "Safety & Security", short: "Safety & Security", color: "#4a9eff", url: "https://www.i3international.com/solutions/#safety-security", desc: "Detect risks early and protect people, assets and operations across all locations." },
  { id: "P2", label: "Operational Insights", short: "Operational Insights", color: "#f59e0b", url: "https://www.i3international.com/solutions/#Operational-insights", desc: "Automate workflows and optimize staffing with real-time performance analytics." },
  { id: "P3", label: "Asset Protection", short: "Asset Protection", color: "#22c55e", url: "https://www.i3international.com/solutions/#asset-protection", desc: "Prevent loss using AI anomaly detection and video-backed insight." },
  { id: "P4", label: "Services", short: "Services", color: "#a855f7", url: "https://www.i3international.com/solutions/", desc: "Managed and professional services that extend the platform — monitoring, analysis and support." },
];

export const SOLUTIONS = [
  { id: "sentry", label: "i3Ai Sentry", short: "Sentry", pillar: "P1", url: "https://www.i3international.com/solutions/i3-ai-sentry/", desc: "AI facial matching against a watchlist to flag persons of interest." },
  { id: "lpr", label: "i3Ai LPR & Gate Access Control", short: "LPR & Gate", pillar: "P1", url: "https://www.i3international.com/solutions/lpr/", desc: "Capture and search license plates and control gate access." },
  { id: "csm", label: "i3Ai Compliance and Safety Management", short: "Compliance & Safety", pillar: "P1" },
  { id: "evt", label: "Encrypted Video Transfer", short: "Encrypted Transfer", pillar: "P1", url: "https://www.i3international.com/solutions/encrypted-video-transfer/", desc: "Securely package and share video evidence with authorities." },
  { id: "slip", label: "i3Ai Slip, Trip & Fall", short: "Slip/Trip/Fall", pillar: "P1", url: "https://www.i3international.com/solutions/slip-and-fall/", desc: "Detect fall events to support response and liability review." },
  { id: "door", label: "i3Ai Door Status", short: "Door Status", pillar: "P1" },
  { id: "thermal", label: "i3Ai Thermal Intelligence", short: "Thermal", pillar: "P1" },
  { id: "talkdown", label: "Audio Talk Down", short: "Audio Talk Down", pillar: "P1" },
  { id: "stream", label: "Video Streaming", short: "Video Streaming", pillar: "P1" },
  { id: "incident", label: "Incident Reporting", short: "Incident Reporting", pillar: "P1" },
  { id: "alert", label: "Alert Centre", short: "Alert Centre", pillar: "P1", url: "https://www.i3international.com/solutions/alert-center", desc: "Centralize and route AI alerts across sites." },
  { id: "trueview", label: "i3 True View", short: "True View", pillar: "P1", url: "https://www.i3international.com/solutions/i3-true-view/", desc: "Unified viewing experience across locations." },
  { id: "smartsensor", label: "Smart Sensor Integration", short: "Smart Sensor", pillar: "P1", desc: "Integrate IoT and environmental sensors for richer, real-time detection and alerting." },
  { id: "concierge", label: "i3 Concierge Plus Service", short: "Concierge Plus", pillar: "P4" },
  { id: "alarms", label: "i3Ai Alarms & Search", short: "Alarms & Search", pillar: "P1", url: "https://www.i3international.com/solutions/i3ai-alarms-search/", desc: "AI-powered event detection and video search — cuts response time and surfaces critical footage in seconds across unlimited sites." },
  { id: "loitering", label: "i3Ai Loitering Detection", short: "Loitering Detection", pillar: "P1", url: "https://www.i3international.com/solutions/i3ai-loitering-detection/", desc: "AI-driven dwell-time monitoring that identifies individuals or groups lingering in designated zones — proactively alerting security before risks escalate." },
  { id: "svc_anom", label: "i3Ai Service Anomaly", short: "Service Anomaly", pillar: "P2" },
  { id: "engage", label: "i3Ai Engagement", short: "Engagement", pillar: "P2" },
  { id: "overflow", label: "i3Ai Customer Overflow", short: "Customer Overflow", pillar: "P2" },
  { id: "loyalty", label: "i3Ai Loyalty", short: "Loyalty", pillar: "P2" },
  { id: "qalert", label: "i3Ai Q-Alert", short: "Q-Alert", pillar: "P2" },
  { id: "traj_analysis", label: "i3Ai Trajectory Analysis", short: "Trajectory Analysis", pillar: "P2" },
  { id: "people", label: "i3Ai People Counting & Conversion", short: "People Count & Conversion", pillar: "P2", url: "https://www.i3international.com/solutions/people-counting/", desc: "AI-powered visitor counting with POS integration to calculate conversion rates — 98% accuracy, standardised across all sites." },
  { id: "velocity", label: "Velocity Timer", short: "Velocity Timer", pillar: "P2", url: "https://www.i3international.com/solutions/velocity-drive-thru-timer/", desc: "Measure drive-thru speed of service and dwell." },
  { id: "donation", label: "i3Ai Donation Tracking", short: "Donation Tracking", pillar: "P2" },
  { id: "region", label: "i3Ai Region Counting", short: "Region Counting", pillar: "P2" },
  { id: "shelf", label: "i3Ai Shelf Intelligence", short: "Shelf Intelligence", pillar: "P2" },
  { id: "table", label: "i3Ai Table Readiness", short: "Table Readiness", pillar: "P2" },
  { id: "heatmap", label: "i3Ai Heat Mapping", short: "Heat Mapping", pillar: "P2", url: "https://www.i3international.com/solutions/i3-heat-mapping/", desc: "Visualise customer traffic patterns and dwell time to optimise layout, product placement, and promotional effectiveness." },
  { id: "sos", label: "i3Ai Speed of Service", short: "Speed of Service", pillar: "P2", url: "https://www.i3international.com/solutions/quick-service-restaurants/", desc: "AI-powered in-store and drive-thru service time monitoring that identifies bottlenecks, benchmarks staff performance, and drives faster throughput across every location." },
  { id: "btb", label: "i3Ai Below the Basket", short: "Below the Basket", pillar: "P3" },
  { id: "walkout", label: "i3Ai Walk Out Detection", short: "Walk-Out Detection", pillar: "P3" },
  { id: "traj_anom", label: "i3Ai Trajectory Anomaly", short: "Trajectory Anomaly", pillar: "P3", url: "https://www.i3international.com/solutions/i3ai-trajectory-anomaly/", desc: "Surface unusual movement paths as loss signals." },
  { id: "smarter", label: "i3Ai Smart Exception Reporting", short: "Smart-ER", pillar: "P3", url: "https://www.i3international.com/solutions/i3ai-smart-er", desc: "Ingests POS data, runs AI exception detection, and pairs flagged exceptions with synchronized POS-camera video." },
  { id: "cart", label: "i3Ai Smart Cart Reconciliation", short: "Cart Reconciliation", pillar: "P3" },
  { id: "drawer", label: "i3Ai Smart Drawer Monitoring", short: "Drawer Monitoring", pillar: "P3" },
  { id: "apanalyst", label: "i3 AP Analyst Service", short: "AP Analyst", pillar: "P3" },
];

export const VERTICALS = [
  { id: "v_qsr", label: "Quick Service Restaurants", color: "#ff7a45" }, { id: "v_cstore", label: "Convenience & Fuel", color: "#ffcf3f" },
  { id: "v_grocery", label: "Grocery", color: "#57c97a" }, { id: "v_commercial", label: "Commercial", color: "#4f9dff" },
  { id: "v_education", label: "Education", color: "#9b8cff" }, { id: "v_retail", label: "Retail", color: "#ff5da2" }, { id: "v_thrift", label: "Thrift", color: "#2dd4bf" },
];
export const VCOLOR = Object.fromEntries(VERTICALS.map((v) => [v.id, v.color]));

export const PAINS = [
  { id: "pp_age_id_verification_compliance", label: "Age (ID) verification / compliance", short: "Age (ID) verification / compliance", kw: ["age", "verification", "compliance", "id"], sols: ["stream", "incident", "smarter"], verts: ["v_cstore", "v_grocery"] , desc: "Failure to check ID for age-restricted products (alcohol, tobacco, cannabis) exposes the store to fines, licence suspension, and regulatory action." },
  { id: "pp_armed_robbery_risk", label: "Armed robbery risk", short: "Armed robbery risk", kw: ["armed", "robbery", "risk", "gun"], sols: ["evt", "door", "thermal", "talkdown", "stream", "incident", "alert"], verts: ["v_qsr", "v_cstore", "v_grocery", "v_commercial", "v_retail", "v_thrift"] , desc: "Staff and customers face risk of physical harm during armed robbery events; incidents require fast response, evidence capture, and deterrence." },
  { id: "pp_audit_trail_requirements", label: "Audit trail requirements", short: "Audit trail requirements", kw: ["audit", "trail", "requirements", "compliance"], sols: [], verts: ["v_qsr", "v_cstore", "v_grocery", "v_commercial", "v_education", "v_retail", "v_thrift"], pillar: "P1" , desc: "Regulators, insurers, and internal teams require timestamped, tamper-evident records of incidents and access events — paper logs no longer meet the standard." },
  { id: "pp_blocked_exits", label: "Blocked Exits", short: "Blocked Exits", kw: ["blocked", "exits", "exit", "osha", "egress", "fire", "obstruction"], sols: ["csm", "incident"], verts: ["v_qsr", "v_cstore", "v_grocery", "v_commercial", "v_education", "v_retail", "v_thrift"] , desc: "Obstructed emergency exits violate OSHA/fire codes and create serious liability in the event of evacuation — often invisible until an audit or incident." },
  { id: "pp_cannabis_tobacco_compliance", label: "Cannabis/Tobacco compliance", short: "Cannabis/Tobacco compliance", kw: ["cannabis", "tobacco", "compliance", "age"], sols: ["stream", "incident", "smarter"], verts: ["v_cstore"] , desc: "Selling age-restricted products without verified compliance creates licence risk; dispensary-adjacent stores face heightened scrutiny from regulators." },
  { id: "pp_cash_handling_risk", label: "Cash handling risk", short: "Cash handling risk", kw: ["cash", "handling", "risk", "drawer", "till"], sols: ["stream", "incident", "svc_anom", "smarter", "drawer", "apanalyst"], verts: ["v_qsr", "v_cstore", "v_grocery", "v_retail", "v_thrift"] , desc: "Unmonitored till counts, shift changes, and drops create exposure to internal theft and discrepancy disputes that are hard to resolve without video-linked POS data." },
  { id: "pp_centralized_investigations", label: "Centralized investigations", short: "Centralized investigations", kw: ["centralized", "investigations", "central", "investigation"], sols: ["stream", "incident", "alert", "smarter", "apanalyst"], verts: ["v_qsr", "v_cstore", "v_grocery", "v_commercial", "v_education", "v_retail", "v_thrift"] , desc: "LP teams managing multiple sites struggle to pull and review footage across locations quickly, slowing case build times and increasing investigation cost." },
  { id: "pp_checkout_abandonment", label: "Checkout abandonment", short: "Checkout abandonment", kw: ["checkout", "abandonment", "abandon", "queue"], sols: ["svc_anom", "engage", "overflow", "loyalty", "qalert", "velocity"], verts: ["v_qsr", "v_cstore", "v_grocery", "v_retail", "v_thrift"] , desc: "Customers leave without completing a purchase due to long lines, poor service signals, or friction at self-checkout — a direct and measurable revenue loss." },
  { id: "pp_conversion_rate", label: "Conversion Rate", short: "Conversion Rate", kw: ["conversion", "rate"], sols: ["svc_anom", "engage", "overflow", "loyalty", "qalert", "traj_analysis", "people", "velocity", "shelf"], verts: ["v_qsr", "v_cstore", "v_grocery", "v_retail", "v_thrift"] , desc: "Foot traffic enters but does not convert to sales; understanding dwell, path, and service interactions is needed to close the gap." },
  { id: "pp_distribution_center_integration", label: "Distribution center integration", short: "Distribution center integration", kw: ["distribution", "center", "integration", "dc", "warehouse"], sols: [], verts: ["v_commercial"], pillar: "P2" , desc: "Disconnected video and operational data between the distribution centre and store network creates blind spots in inventory accountability and incident response." },
  { id: "pp_donation_fraud", label: "Donation fraud", short: "Donation fraud", kw: ["donation", "fraud"], sols: [], verts: ["v_thrift"], pillar: "P1" , desc: "Staff or volunteers under-record or divert donated items and cash before they are counted, eroding mission revenue at the intake point." },
  { id: "pp_donation_counting", label: "Donation Counting", short: "Donation Counting", kw: ["donation", "counting", "count"], sols: ["donation"], verts: ["v_thrift"] , desc: "Without automated counting at the drop-off point, donation volume is estimated rather than measured, making performance reporting unreliable." },
  { id: "pp_drive_thru_timer_and_bottlenecks", label: "Drive Thru Timer & Bottlenecks", short: "Drive Thru Timer & Bottlenecks", kw: ["drive", "thru", "timer", "bottlenecks", "bottleneck"], sols: ["overflow", "qalert", "velocity"], verts: ["v_qsr", "v_cstore"] , desc: "Slow service times at the drive-thru reduce throughput, hurt scores, and frustrate customers; timers alone do not show where the bottleneck actually lives." },
  { id: "pp_employee_theft", label: "Employee theft", short: "Employee theft", kw: ["employee", "theft", "internal"], sols: ["sentry", "evt", "stream", "incident", "svc_anom", "smarter", "drawer", "apanalyst"], verts: ["v_qsr", "v_cstore", "v_grocery", "v_retail", "v_thrift"] , desc: "Internal theft by staff through sweethearting, till skimming, or merchandise diversion is often the largest single shrink driver and hardest to detect without POS-linked video." },
  { id: "pp_enterprise_wide_people_counting", label: "Enterprise Wide People Counting", short: "Enterprise Wide People Counting", kw: ["enterprise", "wide", "people", "counting", "count"], sols: ["people", "region"], verts: ["v_retail", "v_grocery", "v_commercial"] , desc: "Without consistent footfall data across all sites, traffic-to-conversion benchmarking and labour planning are based on guesswork rather than actuals." },
  { id: "pp_fitting_room_theft", label: "Fitting room theft", short: "Fitting room theft", kw: ["fitting", "room", "theft"], sols: ["sentry", "incident", "engage", "qalert"], verts: ["v_retail", "v_thrift"] , desc: "Fitting rooms create an unmonitored zone where merchandise is concealed, tags are removed, or items are swapped; a known hotspot for organised retail crime." },
  { id: "pp_food_prep_monitoring", label: "Food prep monitoring", short: "Food prep monitoring", kw: ["food", "prep", "monitoring"], sols: [], verts: ["v_qsr", "v_cstore"], pillar: "P1" , desc: "Deviations in prep process such as missing steps, wrong temperature, or incorrect timing create food safety risk and inconsistent product quality across shifts." },
  { id: "pp_food_safety_incidents", label: "Food safety incidents", short: "Food safety incidents", kw: ["food", "safety", "incidents", "hygiene"], sols: [], verts: ["v_qsr", "v_cstore", "v_grocery"], pillar: "P1" , desc: "A single food-borne illness incident can trigger regulatory action, media coverage, and lasting brand damage; manual checks create gaps in the compliance record." },
  { id: "pp_food_waste", label: "Food Waste %", short: "Food Waste %", kw: ["food", "waste"], sols: ["shelf", "smarter"], verts: ["v_qsr", "v_cstore", "v_grocery", "v_retail", "v_thrift"] , desc: "Expired, spoiled, or over-ordered perishables represent direct margin loss and a growing compliance concern where food waste reporting is mandated." },
  { id: "pp_franchise_consistency", label: "Franchise consistency", short: "Franchise consistency", kw: ["franchise", "consistency"], sols: ["svc_anom", "engage", "overflow", "loyalty", "qalert", "people", "velocity", "donation", "region", "shelf", "table", "smarter"], verts: ["v_qsr", "v_cstore", "v_grocery", "v_retail", "v_thrift"], desc: "Individual franchise operators may not follow brand SOPs consistently, creating a gap between brand promise and customer experience across locations." },
  { id: "pp_fuel_theft", label: "Fuel theft", short: "Fuel theft", kw: ["fuel", "theft", "gas", "drive", "off"], sols: ["sentry", "lpr", "evt", "thermal", "talkdown", "stream", "incident", "alert", "alarms", "loitering", "smarter"], verts: ["v_cstore"], desc: "Drive-offs and after-hours bulk fuel theft cost operators thousands per incident; recovery is difficult without licence plate capture and real-time alerts." },
  { id: "pp_grab_and_run_theft", label: "Grab-and-run theft", short: "Grab-and-run theft", kw: ["grab", "run", "theft", "smash"], sols: ["sentry", "lpr", "evt", "stream", "incident", "traj_anom", "apanalyst"], verts: ["v_cstore", "v_grocery", "v_retail", "v_thrift"], desc: "Opportunistic thieves grab high-value merchandise and run; speed and volume of these incidents overwhelm staff and require deterrence and fast evidence capture." },
  { id: "pp_high_employee_turnover", label: "High employee turnover", short: "High employee turnover", kw: ["high", "employee", "turnover", "retention"], sols: [], verts: ["v_qsr", "v_cstore", "v_grocery", "v_retail", "v_thrift"], pillar: "P2", desc: "Frequent staff churn drives up recruitment and training costs and degrades service quality; understanding whether service issues contribute requires operational visibility." },
  { id: "pp_high_value_cosmetics_theft", label: "High-value cosmetics theft", short: "High-value cosmetics theft", kw: ["high", "value", "cosmetics", "theft"], sols: ["sentry", "evt", "talkdown", "stream", "incident", "alarms", "loitering", "engage", "traj_analysis", "traj_anom", "smarter"], verts: ["v_retail"], desc: "Cosmetics are a top target for organised boosters due to high resale value and small size; standard shelf placement offers little deterrence." },
  { id: "pp_high_value_customer_service_expectations", label: "High-value customer service expectations", short: "High-value customer service expectations", kw: ["high", "value", "customer", "service", "expectations", "expectation", "vip"], sols: ["sentry", "svc_anom", "engage", "overflow", "loyalty", "qalert"], verts: ["v_retail"], desc: "High-spending customers expect fast, attentive service; failure to deliver drives defection to competitors and reduces lifetime value." },
  { id: "pp_high_value_inventory_monitoring", label: "High-value inventory monitoring", short: "High-value inventory monitoring", kw: ["high", "value", "inventory", "monitoring"], sols: ["sentry", "lpr", "evt", "door", "thermal", "talkdown", "stream", "incident", "alert", "alarms", "loitering", "shelf", "traj_anom"], verts: ["v_retail"], desc: "Luxury or high-ticket items require enhanced monitoring beyond standard EAS; knowing when, where, and by whom they are handled reduces loss and disputes." },
  { id: "pp_employee_training_coaching", label: "Employee Training / Coaching", short: "Employee Training / Coaching", kw: ["employee", "training", "coaching"], sols: [], verts: ["v_qsr", "v_cstore", "v_grocery", "v_retail", "v_thrift"], pillar: "P2", desc: "Inconsistent or insufficient training leads to service failures, compliance breaches, and safety incidents that could be caught with operational monitoring." },
  { id: "pp_inventory_accuracy", label: "Inventory Accuracy", short: "Inventory Accuracy", kw: ["inventory", "accuracy"], sols: ["shelf"], verts: ["v_qsr", "v_cstore", "v_grocery", "v_retail"], desc: "Discrepancies between system-on-hand and physical count drive phantom inventory, poor replenishment decisions, and customer-facing out-of-stocks." },
  { id: "pp_inventory_availability_frustrations", label: "Inventory availability frustrations", short: "Inventory availability frustrations", kw: ["inventory", "availability", "frustrations"], sols: ["engage", "people", "shelf"], verts: ["v_cstore", "v_grocery", "v_retail", "v_thrift"], desc: "Customers who cannot find products on shelves leave without buying and may not return; visibility into real-time shelf status is needed to close the gap." },
  { id: "pp_inventory_turnover", label: "Inventory Turnover", short: "Inventory Turnover", kw: ["inventory", "turnover"], sols: ["engage", "traj_analysis", "region", "shelf", "heatmap"], verts: ["v_cstore", "v_grocery", "v_retail", "v_thrift"], desc: "Slow-moving stock ties up working capital and shelf space; understanding traffic and dwell patterns helps optimise range and placement decisions." },
  { id: "pp_investigation_time", label: "Investigation Time", short: "Investigation Time", kw: ["investigation", "time", "footage", "search"], sols: ["sentry", "lpr", "csm", "evt", "slip", "door", "thermal", "talkdown", "stream", "incident", "alert", "trueview", "alarms", "loitering", "svc_anom", "traj_analysis", "btb", "walkout", "traj_anom", "smarter", "drawer"], verts: ["v_cstore", "v_grocery", "v_commercial", "v_retail"], desc: "Reviewing hours of footage manually to build a case is expensive and slow; delays reduce recovery rates and increase LP team burnout." },
  { id: "pp_labor_of_sales", label: "Labor % of Sales", short: "Labor % of Sales", kw: ["labor", "sales", "labour"], sols: ["engage", "overflow", "qalert", "people", "velocity", "donation", "region", "table", "heatmap"], verts: ["v_qsr", "v_cstore", "v_grocery", "v_retail", "v_thrift"], desc: "Labour cost as a share of revenue is a key profitability metric; without traffic and transaction data it is impossible to right-size staffing to demand." },
  { id: "pp_labor_shortages", label: "Labor shortages", short: "Labor shortages", kw: ["labor", "shortages", "labour", "shortage"], sols: ["engage", "overflow", "qalert", "people", "velocity", "donation", "region", "table", "heatmap"], verts: ["v_qsr", "v_cstore", "v_grocery", "v_retail", "v_thrift"], desc: "Difficulty hiring and retaining frontline staff leaves stores understaffed, degrading service levels and increasing the burden on existing team members." },
  { id: "pp_limited_lp_ap_resources", label: "Limited LP/AP resources", short: "Limited LP/AP resources", kw: ["limited", "resources", "lp", "ap", "resource", "analyst"], sols: ["sentry", "lpr", "csm", "evt", "slip", "door", "thermal", "talkdown", "incident", "alert", "trueview", "alarms", "loitering", "svc_anom", "traj_analysis", "btb", "walkout", "traj_anom", "smarter", "drawer", "apanalyst"], verts: ["v_qsr", "v_cstore", "v_grocery", "v_retail", "v_thrift"], desc: "Small LP teams cannot cover all locations and all shifts; they need smart tools to prioritise where to focus rather than reviewing footage reactively." },
  { id: "pp_limited_overnight_staffing", label: "Limited overnight staffing", short: "Limited overnight staffing", kw: ["limited", "overnight", "staffing", "night"], sols: ["sentry", "lpr", "csm", "evt", "door", "thermal", "talkdown", "alert", "alarms", "loitering", "overflow", "qalert"], verts: ["v_qsr", "v_cstore", "v_grocery", "v_commercial"], desc: "Overnight shifts run with minimal staff, increasing vulnerability to theft, safety incidents, and compliance breaches that go unwitnessed." },
  { id: "pp_lone_worker_safety", label: "Lone-worker safety", short: "Lone-worker safety", kw: ["lone", "worker", "safety"], sols: ["sentry", "lpr", "csm", "door", "thermal", "talkdown", "alert", "alarms", "loitering"], verts: ["v_qsr", "v_cstore", "v_grocery", "v_commercial", "v_retail"], desc: "A single employee closing or working alone has no backup if an incident occurs; detection and remote intervention capability are critical safeguards." },
  { id: "pp_long_checkout_lines", label: "Long checkout lines", short: "Long checkout lines", kw: ["long", "checkout", "lines", "line", "queue", "wait"], sols: ["overflow", "qalert", "velocity", "donation"], verts: ["v_qsr", "v_cstore", "v_grocery", "v_retail", "v_thrift"], desc: "Queues longer than two or three customers cause abandonment, reduce throughput, and damage customer satisfaction scores." },
  { id: "pp_multi_location_consistency", label: "Multi-location consistency", short: "Multi-location consistency", kw: ["multi", "location", "consistency"], sols: ["svc_anom"], verts: ["v_retail", "v_qsr", "v_grocery"] , desc: "Operating standards, service times, and compliance levels vary across sites; without a unified view, underperforming locations are hard to identify and correct." },
  { id: "pp_multi_site_management_complexity", label: "Multi-site management complexity", short: "Multi-site management complexity", kw: ["multi", "site", "management", "complexity"], sols: ["sentry", "lpr", "csm", "stream", "alert", "trueview"], verts: ["v_qsr", "v_cstore", "v_grocery", "v_commercial", "v_education", "v_retail", "v_thrift"], desc: "Managing security, operations, and compliance across dozens or hundreds of sites from disparate systems creates gaps and inefficiencies." },
  { id: "pp_omnichannel_fulfillment_pressure", label: "Omnichannel fulfillment pressure", short: "Omnichannel fulfillment pressure", kw: ["omnichannel", "fulfillment", "pressure", "curbside", "bopis"], sols: ["lpr", "overflow", "people", "velocity", "donation"], verts: ["v_qsr", "v_cstore", "v_grocery", "v_retail"], desc: "BOPIS, curbside, and same-day delivery orders create in-store congestion, fulfilment errors, and tension between in-store and online service levels." },
  { id: "pp_order_accuracy", label: "Order accuracy", short: "Order accuracy", kw: ["order", "accuracy"], sols: ["stream"], verts: ["v_qsr"], desc: "Wrong or incomplete orders drive complaints, remakes, waste, and negative reviews; at QSR scale, small error rates multiply into large costs." },
  { id: "pp_organized_retail_crime", label: "Organized Retail Crime", short: "Organized Retail Crime", kw: ["organized", "retail", "crime", "orc"], sols: ["sentry", "lpr", "evt", "stream", "trueview", "loitering", "traj_analysis", "btb", "walkout", "traj_anom", "smarter", "apanalyst"], verts: ["v_cstore", "v_grocery", "v_retail", "v_thrift"], desc: "Coordinated ORC groups systematically target stores in multiple hits, using boosters, distraction teams, and online fencing networks to move stolen goods." },
  { id: "pp_osha_workplace_safety", label: "OSHA / workplace safety", short: "OSHA / workplace safety", kw: ["osha", "workplace", "safety", "compliance"], sols: ["csm", "evt", "slip", "door", "incident", "alert", "alarms", "loitering"], verts: ["v_qsr", "v_cstore", "v_grocery", "v_commercial", "v_education", "v_retail", "v_thrift"], desc: "Recordable workplace injuries and near-misses carry direct cost through workers comp, fines, and litigation, plus the risk of site closure." },
  { id: "pp_out_of_stocks", label: "Out-of-Stocks", short: "Out-of-Stocks", kw: ["out", "stocks", "stock", "oos"], sols: ["stream", "trueview", "shelf"], verts: ["v_cstore", "v_grocery", "v_retail"], desc: "Empty shelves at the point of purchase send customers to competitors; identifying whether the cause is shrink, forecasting, or replenishment failure requires data." },
  { id: "pp_parking_lot_incidents", label: "Parking lot incidents", short: "Parking lot incidents", kw: ["parking", "lot", "incidents", "vehicle"], sols: ["lpr", "csm", "stream", "trueview", "alarms", "loitering"], verts: ["v_qsr", "v_cstore", "v_grocery", "v_commercial", "v_education", "v_retail", "v_thrift"], desc: "Assaults, vehicle damage, and theft in car parks create liability, deter customers, and strain security resources beyond the store perimeter." },
  { id: "pp_people_counting", label: "People Counting", short: "People Counting", kw: ["people", "counting", "count", "traffic"], sols: ["stream", "trueview", "people"], verts: ["v_qsr", "v_cstore", "v_grocery", "v_commercial", "v_education", "v_retail", "v_thrift"], desc: "Without accurate footfall data, labour scheduling, conversion rate analysis, and store layout decisions are based on intuition rather than evidence." },
  { id: "pp_pharmacy_compliance_diversion", label: "Pharmacy compliance / diversion", short: "Pharmacy compliance / diversion", kw: ["pharmacy", "compliance", "diversion"], sols: ["smarter", "sentry"], verts: ["v_grocery", "v_retail"] , desc: "Controlled substances in pharmacy departments require strict access and dispensing controls; diversion by staff or customers creates regulatory and liability exposure." },
  { id: "pp_planogram_compliance", label: "Planogram compliance", short: "Planogram compliance", kw: ["planogram", "compliance", "shelf"], sols: ["shelf"], verts: ["v_cstore", "v_grocery", "v_retail"], desc: "Shelves that do not match the agreed planogram undermine promotional effectiveness, category management, and supplier compliance reporting." },
  { id: "pp_poor_in_store_service_visibility", label: "Poor in-store service visibility", short: "Poor in-store service visibility", kw: ["poor", "store", "service", "visibility"], sols: ["svc_anom", "engage"], verts: ["v_retail", "v_qsr", "v_grocery"] , desc: "Managers lack real-time visibility into where staff are, how customers are being served, and where service breakdowns are occurring on the floor." },
  { id: "pp_product_placement", label: "Product Placement %", short: "Product Placement %", kw: ["product", "placement"], sols: ["trueview", "traj_analysis", "region", "heatmap"], verts: ["v_cstore", "v_grocery", "v_commercial", "v_education", "v_retail", "v_thrift"], desc: "Promotional and high-margin products placed in low-traffic zones generate less lift than expected; traffic data is needed to validate placement decisions." },
  { id: "pp_queue_management", label: "Queue management", short: "Queue management", kw: ["queue", "management", "line", "wait"], sols: ["overflow", "qalert", "people", "table", "sos"], verts: ["v_qsr", "v_cstore", "v_grocery", "v_retail", "v_thrift"], desc: "Unmanaged queues at checkout, service counters, or drive-thrus create customer frustration, staff stress, and measurable revenue loss from abandonment." },
  { id: "pp_remote_visibility", label: "Remote visibility", short: "Remote visibility", kw: ["remote", "visibility", "live"], sols: ["stream", "trueview"], verts: ["v_cstore", "v_grocery", "v_commercial", "v_retail", "v_thrift"], desc: "Operators without live remote access to site cameras and data cannot verify incidents, coach staff, or respond to alerts without physically travelling to site." },
  { id: "pp_return_fraud", label: "Return fraud", short: "Return fraud", kw: ["return", "fraud", "refund"], sols: ["sentry", "evt", "talkdown", "svc_anom", "smarter", "drawer", "apanalyst"], verts: ["v_qsr", "v_cstore", "v_grocery", "v_retail", "v_thrift"], desc: "Fraudulent returns such as wardrobing, receipt fraud, or returning stolen goods are difficult to detect at the counter without video-linked transaction data." },
  { id: "pp_safety_concerns", label: "Safety concerns", short: "Safety concerns", kw: ["safety", "concerns", "concern"], sols: ["sentry", "lpr", "csm", "evt", "slip", "door", "thermal", "talkdown", "stream", "incident", "alert", "trueview", "alarms", "loitering"], verts: ["v_qsr", "v_cstore", "v_grocery", "v_commercial", "v_education", "v_retail", "v_thrift"], desc: "Generalised safety concerns across the site from slip hazards to aggressive customers require a systematic approach to detection, escalation, and documentation." },
  { id: "pp_sales_per_sq_ft", label: "Sales per Sq Ft", short: "Sales per Sq Ft", kw: ["sales", "square", "foot", "sqft"], sols: ["traj_analysis", "region", "shelf", "heatmap"], verts: ["v_qsr", "v_cstore", "v_grocery", "v_retail", "v_thrift"], desc: "Low revenue density indicates underperforming areas of the store; understanding traffic flow and dwell time is needed to optimise layout and range." },
  { id: "pp_seasonal_labour_fluctuations", label: "Seasonal labour fluctuations", short: "Seasonal labour fluctuations", kw: ["seasonal", "labour", "fluctuations", "labor"], sols: ["sentry", "lpr", "csm", "evt", "door", "incident", "alarms", "loitering", "svc_anom", "engage", "overflow", "qalert", "traj_analysis", "people", "velocity", "donation", "shelf", "table", "sos", "btb", "walkout", "traj_anom", "smarter", "apanalyst"], verts: ["v_qsr", "v_cstore", "v_grocery", "v_commercial", "v_retail", "v_thrift"], desc: "Hiring surges at peak trading periods create training gaps, service inconsistency, and higher rates of compliance and theft incidents." },
  { id: "pp_self_checkout_shrink_abuse", label: "Self-checkout shrink/abuse", short: "Self-checkout shrink/abuse", kw: ["self", "checkout", "shrink", "abuse", "sco"], sols: ["cart", "btb", "smarter"], verts: ["v_grocery", "v_retail"] , desc: "Self-checkout enables deliberate scan avoidance, item substitution, and scale fraud that standard EAS and camera coverage cannot reliably catch." },
  { id: "pp_signage_optimization_rate", label: "Signage Optimization Rate", short: "Signage Optimization Rate", kw: ["signage", "optimization", "rate"], sols: ["traj_analysis", "region"], verts: ["v_retail", "v_grocery"] , desc: "Promotional signage placed in low-footfall zones fails to generate the expected uplift; path and dwell data shows where messaging actually reaches customers." },
  { id: "pp_site_uptime_monitoring", label: "Site uptime monitoring", short: "Site uptime monitoring", kw: ["site", "uptime", "monitoring", "monitor", "health"], sols: [], verts: ["v_commercial", "v_retail", "v_grocery", "v_cstore"] , desc: "Camera or system outages create unmonitored gaps that are exploited by offenders; downtime also delays incident response and breaks the evidence chain." },
  { id: "pp_slip_trip_and_fall_cost_liability", label: "Slip, Trip & Fall Cost/Liability", short: "Slip, Trip & Fall Cost/Liability", kw: ["slip", "trip", "fall", "cost", "liability", "osha"], sols: ["slip", "incident", "evt"], verts: ["v_retail", "v_grocery", "v_commercial"] , desc: "Slip, trip, and fall claims are a leading source of retail litigation; without timestamped video evidence, liability is difficult to contest." },
  { id: "pp_speed_of_service", label: "Speed of Service", short: "Speed of Service", kw: ["speed", "service", "sos"], sols: ["velocity", "svc_anom", "table"], verts: ["v_qsr"] , desc: "Slow service times reduce throughput, hurt customer satisfaction, and in QSR directly impact brand score metrics that affect franchisee standing." },
  { id: "pp_staffing_shortages", label: "Staffing shortages", short: "Staffing shortages", kw: ["staffing", "shortages", "shortage", "labour"], sols: ["engage", "people"], verts: ["v_retail", "v_qsr", "v_grocery"] , desc: "Chronic understaffing forces operators to run with unsafe ratios, increases overtime costs, and degrades both security and service quality." },
  { id: "pp_standardized_reporting", label: "Standardized reporting", short: "Standardized reporting", kw: ["standardized", "reporting", "standard", "report"], sols: ["incident"], verts: ["v_retail", "v_qsr", "v_grocery", "v_commercial"] , desc: "Inconsistent reporting formats across sites make it impossible to compare performance, spot trends, or present a coherent picture to senior leadership." },
  { id: "pp_stockroom_control", label: "Stockroom control", short: "Stockroom control", kw: ["stockroom", "control", "backroom"], sols: ["region", "traj_anom"], verts: ["v_retail", "v_grocery"] , desc: "Unsupervised stockroom access creates opportunity for internal theft and receiving fraud that is invisible without camera coverage and access logging." },
  { id: "pp_sweethearting", label: "Sweethearting", short: "Sweethearting", kw: ["sweethearting", "discount", "collusion"], sols: ["smarter", "apanalyst"], verts: ["v_retail", "v_grocery", "v_cstore", "v_qsr"] , desc: "Cashiers giving unauthorised discounts or not scanning items for friends and family is a pervasive, low-visibility form of internal theft." },
  { id: "pp_tool_electronics_theft", label: "Tool/electronics theft", short: "Tool/electronics theft", kw: ["tool", "electronics", "theft"], sols: ["traj_anom", "sentry"], verts: ["v_retail", "v_commercial"] , desc: "High-value tools and electronics are a top target for organised retail crime; their portability and resale value make them disproportionate shrink contributors." },
  { id: "pp_training_inconsistency", label: "Training inconsistency", short: "Training inconsistency", kw: ["training", "inconsistency"], sols: ["engage"], verts: ["v_retail", "v_qsr", "v_grocery"] , desc: "Staff trained differently across sites or shifts produce inconsistent outcomes; identifying the gap requires observation data, not just test scores." },
  { id: "pp_volunteer_oversight", label: "Volunteer oversight", short: "Volunteer oversight", kw: ["volunteer", "oversight"], sols: ["engage"], verts: ["v_thrift"] , desc: "Volunteers handling donations and cash in charity retail environments require oversight to maintain accountability without creating a culture of distrust." },
  { id: "pp_workplace_violence", label: "Workplace violence", short: "Workplace violence", kw: ["workplace", "violence", "aggression", "fight"], sols: ["csm", "alert", "sentry"], verts: ["v_retail", "v_grocery", "v_cstore", "v_commercial", "v_education"] , desc: "Physical altercations, threats, and aggressive behaviour toward staff and customers are rising across all retail and service verticals." },
  { id: "pp_cybersecurity_and_device_hardening", label: "Cybersecurity & device hardening", short: "Cybersecurity & device hardening", kw: ["cybersecurity", "device", "hardening", "cyber", "hacking", "network", "firmware", "password", "breach", "ndaa"], sols: [], verts: ["v_commercial", "v_education", "v_grocery", "v_retail", "v_cstore"], pillar: "P1" , desc: "IP cameras and VMS platforms are increasingly targeted in cyberattacks; unpatched devices and default credentials create network entry points." },
  { id: "pp_network_bandwidth_and_storage_load", label: "Network bandwidth & storage load", short: "Network bandwidth & storage load", kw: ["network", "bandwidth", "storage", "load"], sols: [], verts: ["v_commercial", "v_grocery", "v_retail"] , desc: "High-resolution multi-camera deployments strain network bandwidth and storage infrastructure, driving up cost and creating retention gaps." },
  { id: "pp_legacy_system_vms_integration", label: "Legacy system / VMS integration", short: "Legacy system / VMS integration", kw: ["legacy", "system", "vms", "integration", "api", "migration"], sols: [], verts: ["v_commercial", "v_grocery", "v_retail", "v_qsr"] , desc: "Older VMS platforms and analogue cameras cannot support modern AI analytics, creating pressure to replace or integrate disparate systems." },
  { id: "pp_ndaa_supply_chain_compliance", label: "NDAA / supply-chain compliance", short: "NDAA / supply-chain compliance", kw: ["ndaa", "supply", "chain", "compliance", "banned"], sols: [], verts: ["v_commercial", "v_education", "v_grocery"], pillar: "P1" , desc: "Federal procurement rules prohibit the use of camera hardware from certain Chinese manufacturers; non-compliant installations risk contract loss and audit findings." },
  { id: "pp_cyber_physical_convergence", label: "Cyber-physical convergence", short: "Cyber-physical convergence", kw: ["cyber", "physical", "convergence"], sols: ["evt"], verts: ["v_commercial", "v_retail", "v_grocery"] , desc: "Physical security events such as access breaches and tailgating and cyber events such as network intrusions are increasingly linked; siloed teams miss the combined threat picture." },
  { id: "pp_it_resource_constraints", label: "IT resource constraints", short: "IT resource constraints", kw: ["resource", "constraints", "maintenance", "support"], sols: ["concierge"], verts: ["v_retail", "v_grocery", "v_commercial"] , desc: "Overstretched IT teams cannot support the deployment, patching, and monitoring of large camera estates without automation and remote management tools." },
  { id: "pp_single_pane_of_glass_centralized_vms", label: "Single pane of glass / centralized VMS", short: "Single pane of glass / centralized VMS", kw: ["single", "pane", "glass", "centralized", "vms", "dashboard"], sols: ["trueview"], verts: ["v_retail", "v_grocery", "v_cstore", "v_commercial"] , desc: "Security teams managing multiple VMS platforms across sites waste time context-switching and miss incidents that fall between system boundaries." },
  { id: "pp_video_data_retention_and_storage_cost", label: "Video data retention & storage cost", short: "Video data retention & storage cost", kw: ["video", "data", "retention", "storage", "cost", "archive"], sols: [], verts: ["v_retail", "v_grocery", "v_commercial"] , desc: "Regulatory requirements for 30, 60, or 90-day retention across large camera counts drive significant storage infrastructure cost." },
  { id: "pp_hipaa_and_healthcare_privacy_compliance", label: "HIPAA & healthcare privacy compliance", short: "HIPAA & healthcare privacy compliance", kw: ["hipaa", "healthcare", "privacy", "compliance", "patient", "phi", "pharmacy"], sols: ["evt"], verts: ["v_grocery", "v_retail", "v_education"] , desc: "Camera deployments in healthcare-adjacent spaces must comply with HIPAA; patient and staff privacy must be designed in, not bolted on." },
  { id: "pp_data_privacy_and_pipeda_gdpr_compliance", label: "Data privacy & PIPEDA / GDPR compliance", short: "Data privacy & PIPEDA / GDPR compliance", kw: ["data", "privacy", "pipeda", "gdpr", "compliance", "ccpa", "legislation", "consent"], sols: ["evt"], verts: ["v_commercial", "v_retail", "v_grocery", "v_education"] , desc: "Privacy regulators are imposing significant fines for surveillance deployments that lack consent frameworks, retention limits, and access controls." },
  { id: "pp_facial_recognition_consent_and_biometric_privacy", label: "Facial recognition consent & biometric privacy", short: "Facial recognition consent & biometric privacy", kw: ["facial", "recognition", "consent", "biometric", "privacy"], sols: ["sentry", "evt"], verts: ["v_retail", "v_grocery", "v_commercial"] , desc: "Using facial recognition without explicit consent and legal basis violates privacy legislation in an increasing number of jurisdictions." },
  { id: "pp_video_access_governance", label: "Video access governance", short: "Video access governance", kw: ["video", "access", "governance", "permission", "audit"], sols: ["evt"], verts: ["v_commercial", "v_retail", "v_grocery"] , desc: "Unrestricted access to live and recorded video creates data breach risk and privacy liability; role-based access and audit logs are a regulatory expectation." },
  { id: "pp_weapons_detection_on_campus", label: "Weapons detection on campus", short: "Weapons detection on campus", kw: ["weapons", "detection", "campus", "weapon", "gun", "knife", "firearm"], sols: [], verts: ["v_education"], pillar: "P1" , desc: "Identifying firearms and edged weapons before an incident occurs requires technology beyond standard CCTV; detection gaps create catastrophic liability." },
  { id: "pp_vaping_and_e_cigarette_detection", label: "Vaping & e-cigarette detection", short: "Vaping & e-cigarette detection", kw: ["vaping", "cigarette", "detection", "vape", "ecigarette", "smoke", "bathroom"], sols: [], verts: ["v_education"], pillar: "P1" , desc: "Vaping in bathrooms and concealed areas is a disciplinary and health challenge; detection without invading privacy requires sensor-based rather than camera-based approaches." },
  { id: "pp_bullying_and_student_aggression", label: "Bullying & student aggression", short: "Bullying & student aggression", kw: ["bullying", "student", "aggression", "bully", "fight"], sols: ["csm", "incident", "alert"], verts: ["v_education"] , desc: "Bullying in corridors, bathrooms, and outdoor areas often goes unreported and undetected until escalation; early identification requires behavioural analytics." },
  { id: "pp_visitor_and_unauthorized_access_management", label: "Visitor & unauthorized access management", short: "Visitor & unauthorized access management", kw: ["visitor", "unauthorized", "access", "management", "badge"], sols: ["lpr", "sentry", "door"], verts: ["v_education", "v_commercial"] , desc: "Unvetted visitors and unauthorised individuals accessing campus create safeguarding risk; manual sign-in processes are unreliable and easy to circumvent." },
  { id: "pp_emergency_lockdown_and_mass_alerting", label: "Emergency lockdown & mass alerting", short: "Emergency lockdown & mass alerting", kw: ["emergency", "lockdown", "mass", "alerting", "evacuation", "active"], sols: ["alert", "talkdown", "csm", "incident"], verts: ["v_education", "v_commercial"] , desc: "Activating a campus-wide lockdown quickly and communicating clearly to students, staff, and responders is a life-safety capability that requires integration and rehearsal." },
  { id: "pp_bus_loop_and_student_pickup_safety", label: "Bus loop & student pickup safety", short: "Bus loop & student pickup safety", kw: ["bus", "loop", "student", "pickup", "safety", "dropoff", "parent"], sols: ["lpr", "people", "region"], verts: ["v_education"] , desc: "Arrival and dismissal periods concentrate risk at the bus loop and car park; verifying authorised pick-up and preventing unauthorised vehicle access requires monitoring." },
  { id: "pp_after_hours_campus_intrusion", label: "After-hours campus intrusion", short: "After-hours campus intrusion", kw: ["after", "hours", "campus", "intrusion", "trespass", "night"], sols: ["csm", "alert", "sentry"], verts: ["v_education", "v_commercial"] , desc: "Empty campuses after hours are targets for vandalism, theft, and trespass; detection and deterrence without on-site staff requires automated monitoring." },
  { id: "pp_classroom_occupancy_and_attendance", label: "Classroom occupancy & attendance", short: "Classroom occupancy & attendance", kw: ["classroom", "occupancy", "attendance"], sols: ["people", "region"], verts: ["v_education"] , desc: "Accurate occupancy data supports space utilisation, emergency roll calls, and compliance with safe staffing ratios across a multi-building campus." },
  // --- 2024-2026 researched additions (suggested solution links flagged for validation) ---
  { id: "pp_e_fencing_online_resale", label: "E-fencing / online resale of stolen goods", short: "E-fencing / online resale", kw: ["efencing", "online", "resale", "marketplace", "orc", "fence"], sols: ["sentry", "smarter", "apanalyst", "incident"], verts: ["v_retail", "v_grocery", "v_cstore"] , desc: "Stolen merchandise is rapidly sold through online marketplaces, accelerating the cycle of organised theft and making recovery difficult without digital intelligence." },
  { id: "pp_gift_card_fraud", label: "Gift card fraud", short: "Gift card fraud", kw: ["gift", "card", "fraud", "draining"], sols: ["smarter", "drawer", "apanalyst"], verts: ["v_retail", "v_grocery", "v_cstore"] , desc: "Fraudsters drain gift card balances through balance-checking attacks or return fraud; transaction anomalies are invisible without POS-linked video." },
  { id: "pp_cargo_supply_chain_theft", label: "Cargo & supply-chain theft", short: "Cargo & supply-chain theft", kw: ["cargo", "supply", "chain", "freight", "trailer", "theft"], sols: ["sentry", "lpr", "incident", "trueview"], verts: ["v_retail", "v_grocery"] , desc: "Cargo theft from loading docks and in-transit costs the industry billions annually; receiving areas are a key vulnerability in multi-site retail operations." },
  { id: "pp_smash_and_grab", label: "Smash-and-grab / flash-mob theft", short: "Smash-and-grab / flash-mob", kw: ["smash", "grab", "flash", "mob", "blitz", "raid"], sols: ["walkout", "talkdown", "alert", "sentry"], verts: ["v_retail", "v_grocery", "v_cstore"] , desc: "Coordinated flash-mob or smash-and-grab incidents overwhelm staff response capability and clear shelves of high-value merchandise in minutes." },
  { id: "pp_repeat_offender_tracking", label: "Repeat-offender / booster tracking", short: "Repeat-offender tracking", kw: ["repeat", "offender", "booster", "recidivist", "watchlist"], sols: ["sentry", "lpr", "trueview", "apanalyst"], verts: ["v_retail", "v_grocery", "v_cstore"] , desc: "Known offenders return to the same stores repeatedly; without a way to identify and alert on their presence, each visit starts from zero." },
  { id: "pp_locked_case_sales_friction", label: "Locked-case sales friction", short: "Locked-case sales friction", kw: ["locked", "case", "spider", "wrap", "friction", "service"], sols: ["concierge", "qalert", "engage", "overflow"], verts: ["v_retail", "v_grocery"] , desc: "Merchandise locked in cases to deter theft creates a service barrier that frustrates customers and requires staff to unlock, reducing throughput and conversion." },
  { id: "pp_associate_safety_attrition", label: "Associate safety-driven attrition", short: "Associate safety attrition", kw: ["associate", "worker", "safety", "attrition", "turnover", "quit"], sols: ["talkdown", "alert", "csm", "incident"], verts: ["v_retail", "v_grocery", "v_cstore"] , desc: "Over 40% of retail workers report considering leaving their jobs due to safety concerns; unaddressed, safety failures drive attrition and vacancy costs." },
  { id: "pp_phone_ecommerce_fraud", label: "Phone & e-commerce fraud (ORC-linked)", short: "Phone & e-commerce fraud", kw: ["phone", "scam", "ecommerce", "fraud", "refund"], sols: ["smarter", "apanalyst", "incident"], verts: ["v_retail", "v_grocery"] , desc: "Phone scams and e-commerce fraud linked to ORC networks are rising; losses from these channels now rival in-store theft for many large retailers." },
  { id: "pp_fresh_department_shrink", label: "Fresh department shrink (deli / produce / bakery)", short: "Fresh department shrink", kw: ["fresh", "deli", "produce", "bakery", "spoilage", "shrink"], sols: ["shelf", "smarter", "svc_anom", "sentry"], verts: ["v_grocery"] , desc: "Deli, produce, bakery, and seafood departments carry shrink rates of 7 to 9% vs 1 to 2% for dry goods; perishability, waste, and theft compound the problem." },
  { id: "pp_cold_chain_temperature_monitoring", label: "Cold-chain temperature monitoring", short: "Cold-chain temperature", kw: ["cold", "chain", "temperature", "cooler", "freezer", "spoilage"], sols: ["thermal", "alert", "incident"], verts: ["v_grocery", "v_qsr", "v_cstore"] , desc: "A break in the cold chain creates food safety risk, product loss, and regulatory liability; manual checks create gaps across overnight and weekend periods." },
  { id: "pp_curbside_online_order_integrity", label: "Curbside & online order integrity", short: "Curbside & online order integrity", kw: ["curbside", "online", "order", "pickup", "bopis", "integrity"], sols: ["svc_anom", "overflow", "incident"], verts: ["v_grocery", "v_qsr"] , desc: "BOPIS and curbside orders create fulfilment errors, substitution disputes, and customer service escalations that are hard to resolve without order-linked video." },
  { id: "pp_supply_chain_disruption", label: "Supply-chain disruption & cost pressure", short: "Supply-chain disruption", kw: ["supply", "chain", "disruption", "tariff", "cost", "sourcing"], sols: ["shelf", "smarter"], verts: ["v_grocery", "v_retail", "v_cstore"] , desc: "Tariffs, sourcing shifts, and logistics volatility are driving up cost and creating unpredictable out-of-stock events across grocery and retail supply chains." },
  { id: "pp_pump_card_skimming", label: "Gas-pump card skimming", short: "Pump card skimming", kw: ["pump", "skimmer", "skimming", "card", "fuel", "fraud"], sols: ["trueview", "sentry", "incident", "lpr"], verts: ["v_cstore"] , desc: "Criminals install skimming devices on fuel dispensers to steal card data; without physical inspection and camera monitoring, devices can go undetected for weeks." },
  { id: "pp_bulk_fuel_tank_theft", label: "Bulk fuel / tank theft", short: "Bulk fuel / tank theft", kw: ["bulk", "fuel", "tank", "bladder", "diesel", "theft"], sols: ["lpr", "sentry", "alert", "thermal"], verts: ["v_cstore"] , desc: "Organised criminals siphon fuel directly from underground storage tanks using specialised equipment; losses can reach thousands of litres in a single incident." },
  { id: "pp_tobacco_vape_theft", label: "Tobacco & vape theft / black market", short: "Tobacco & vape theft", kw: ["tobacco", "vape", "cigarette", "black", "market", "theft"], sols: ["smarter", "sentry", "walkout", "apanalyst"], verts: ["v_cstore", "v_retail"] , desc: "Tobacco and vape products are a primary ORC target; flavour bans and tax hikes have created a thriving black market that drives aggressive theft." },
  { id: "pp_beer_cave_grab_and_run", label: "Beer-cave grab-and-run", short: "Beer-cave grab-and-run", kw: ["beer", "cave", "cooler", "grab", "run", "alcohol"], sols: ["walkout", "talkdown", "alert"], verts: ["v_cstore"] , desc: "Walk-in beer coolers allow offenders to grab cases of product and run with minimal resistance; their layout creates an easy exit path." },
  { id: "pp_forecourt_loitering", label: "Forecourt loitering & vagrancy", short: "Forecourt loitering", kw: ["forecourt", "loitering", "vagrancy", "panhandling", "pump"], sols: ["sentry", "talkdown", "csm", "alert"], verts: ["v_cstore"] , desc: "Persistent loiterers and panhandlers on the forecourt deter customers, create safety concerns for staff, and require a proportionate and documented response." },
  { id: "pp_drive_thru_tech_failures", label: "Drive-thru tech failures (payment / timer)", short: "Drive-thru tech failures", kw: ["drive", "thru", "payment", "timer", "kiosk", "failure", "outage"], sols: ["velocity", "svc_anom", "alert"], verts: ["v_qsr"] , desc: "Payment processing failures, timer errors, and kiosk outages at the drive-thru force manual workarounds that slow service and create order errors." },
  { id: "pp_mobile_delivery_pickup_errors", label: "Mobile & delivery order pickup errors", short: "Mobile & delivery pickup errors", kw: ["mobile", "delivery", "doordash", "ubereats", "pickup", "order", "wrong"], sols: ["svc_anom", "overflow", "incident", "engage"], verts: ["v_qsr"] , desc: "Third-party delivery and mobile pick-up orders are frequently assigned to the wrong person or prepared incorrectly, driving complaints and remaking costs." },
  { id: "pp_kitchen_equipment_downtime", label: "Kitchen equipment downtime", short: "Kitchen equipment downtime", kw: ["kitchen", "equipment", "downtime", "breakdown", "fryer", "grill"], sols: ["svc_anom", "alert", "incident"], verts: ["v_qsr"] , desc: "Equipment breakdowns in a QSR kitchen force menu items off sale, create safety risks, and erode customer satisfaction; detection time is a key cost driver." },
  { id: "pp_dining_lobby_cleanliness", label: "Dining area & lobby cleanliness", short: "Dining & lobby cleanliness", kw: ["dining", "lobby", "cleanliness", "table", "spill", "restroom"], sols: ["svc_anom", "table", "engage"], verts: ["v_qsr"] , desc: "Unattended spills, dirty tables, and overcrowded lobbies damage the customer experience and create safety hazards; visibility into dwell and occupancy is needed." },
  { id: "pp_tailgating_secure_entries", label: "Tailgating at secure entries", short: "Tailgating at secure entries", kw: ["tailgating", "piggyback", "badge", "door", "entry", "unauthorized"], sols: ["door", "sentry", "alert", "trueview"], verts: ["v_commercial"] , desc: "Social engineering at controlled access points allows unauthorised individuals to follow staff through secured doors; one of the most common physical security failures." },
  { id: "pp_after_hours_facility_intrusion", label: "After-hours facility intrusion", short: "After-hours facility intrusion", kw: ["after", "hours", "intrusion", "breakin", "trespass", "perimeter"], sols: ["sentry", "csm", "alert", "talkdown"], verts: ["v_commercial", "v_thrift"] , desc: "Empty buildings overnight and on weekends are primary targets for break-in; detection and deterrence without on-site security requires automated monitoring and response." },
  { id: "pp_office_equipment_theft", label: "Office & equipment theft", short: "Office & equipment theft", kw: ["office", "laptop", "equipment", "asset", "theft", "insider"], sols: ["sentry", "trueview", "incident", "smarter"], verts: ["v_commercial"] , desc: "Laptops, phones, and portable equipment are targeted in office break-ins; a single incident can compromise sensitive data as well as physical assets." },
  { id: "pp_loading_dock_theft", label: "Loading dock & receiving theft", short: "Loading dock theft", kw: ["loading", "dock", "receiving", "shipping", "theft", "shrink"], sols: ["lpr", "sentry", "incident", "trueview"], verts: ["v_commercial", "v_retail", "v_grocery"] , desc: "Receiving areas are a high-risk zone for internal and external theft; collusion between staff and delivery drivers is difficult to detect without video-linked records." },
  { id: "pp_after_hours_vandalism", label: "After-hours vandalism & graffiti", short: "After-hours vandalism", kw: ["vandalism", "graffiti", "damage", "after", "hours", "property"], sols: ["sentry", "csm", "talkdown", "alert"], verts: ["v_commercial", "v_education", "v_thrift"] , desc: "Vandalism and graffiti after hours impose repair and cleaning costs, degrade brand appearance, and in some cases signal escalating security threats." },
  { id: "pp_swatting_false_threats", label: "Swatting & false threat calls", short: "Swatting & false threats", kw: ["swatting", "false", "threat", "hoax", "bomb", "call"], sols: ["csm", "alert", "incident"], verts: ["v_education"] , desc: "False emergency calls trigger costly police responses and campus evacuations; documenting the absence of a genuine threat requires real-time video verification." },
  { id: "pp_student_wellbeing_signals", label: "Student wellbeing & distress signals", short: "Student wellbeing signals", kw: ["student", "wellbeing", "distress", "isolation", "support", "alert"], sols: ["csm", "alert", "incident"], verts: ["v_education"] , desc: "Students in distress, experiencing bullying, or at risk of self-harm often display behavioural signals before an incident; early detection requires proactive monitoring." },
  { id: "pp_arrival_dismissal_congestion", label: "Arrival & dismissal congestion", short: "Arrival & dismissal congestion", kw: ["arrival", "dismissal", "congestion", "carline", "pickup", "traffic"], sols: ["lpr", "region", "people", "traj_analysis"], verts: ["v_education"] , desc: "Arrival and dismissal create predictable congestion and safety risks; unauthorised vehicles and unknown individuals in the car line require identification and access controls." },
  { id: "pp_after_hours_donation_dumping", label: "After-hours donation dumping", short: "After-hours donation dumping", kw: ["donation", "dumping", "illegal", "after", "hours", "trash"], sols: ["sentry", "csm", "talkdown", "alert"], verts: ["v_thrift"] , desc: "Donors leave items outside after hours, including furniture, hazardous goods, and unsellable waste; the cleanup cost falls entirely on the charity." },
  { id: "pp_donation_bin_looting", label: "Donation bin looting (after hours)", short: "Donation bin looting", kw: ["donation", "bin", "looting", "rummage", "theft", "after", "hours"], sols: ["sentry", "talkdown", "alert", "trueview"], verts: ["v_thrift"] , desc: "After-hours looting of outdoor donation bins deprives the charity of saleable stock and creates a visible disorder problem that deters legitimate donors." },
  { id: "pp_unsellable_donation_sorting", label: "Unsellable donation sorting load", short: "Unsellable donation sorting", kw: ["unsellable", "donation", "sorting", "waste", "disposal", "labor"], sols: ["donation", "svc_anom", "smarter"], verts: ["v_thrift"] , desc: "Staff and volunteers spend significant time sorting through unusable donations that should never have been accepted; the disposal cost is a direct operational drain." },
  { id: "pp_hazardous_donation_dropoff", label: "Hazardous donation drop-off", short: "Hazardous donation drop-off", kw: ["hazardous", "donation", "dropoff", "evacuation", "safety", "chemical"], sols: ["sentry", "incident", "csm", "alert"], verts: ["v_thrift"], desc: "Occasionally donors leave hazardous materials such as chemicals, sharps, or mould-contaminated items that trigger evacuation, disposal cost, and staff safety risk." },
  { id: "pp_donation_surge_bottlenecks", label: "Donation surge bottlenecks", short: "Donation surge bottlenecks", kw: ["donation", "surge", "bottleneck", "queue", "dropoff", "seasonal"], sols: ["donation", "overflow", "people", "region"], verts: ["v_thrift"] , desc: "Spring and post-holiday donation surges overwhelm sorting capacity, creating queues, donor frustration, and processing backlogs that delay inventory to shelves." },
];

export const COLORS = { core: "#ff9ec5", pillar: "#e6b14a", solution: "#22c1e0", pain: "#ff5d6c", vertical: "#a98bf0", bg: "#0a1428" };

export const CORE = { id: "core", type: TYPE.CORE, label: "i3Ai", short: "i3Ai", desc: "i3's Ai engine — the core that powers every solution in the platform." };
// Tag each record with its type IN PLACE (not via spread copies) so that
// NODE_BY_ID[id] is the SAME object as the entry in PILLARS/SOLUTIONS/PAINS.
// The editor mutates pain records through NODE_BY_ID while saveMap/exportMap
// read them through PAINS — they must be one and the same object, or edits
// silently fail to persist.
PILLARS.forEach((p) => (p.type = TYPE.PILLAR));
SOLUTIONS.forEach((s) => (s.type = TYPE.SOLUTION));
PAINS.forEach((p) => (p.type = TYPE.PAIN));
export const NODES = [CORE, ...PILLARS, ...SOLUTIONS, ...PAINS];
export const NODE_BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n]));
export const IDX = Object.fromEntries(NODES.map((n, i) => [n.id, i]));

export const EDGES = [];
export function rebuildEdges() {
  EDGES.length = 0;
  PILLARS.forEach((p) => EDGES.push({ a: "core", b: p.id, kind: "core" }));
  SOLUTIONS.forEach((s) => EDGES.push({ a: s.id, b: s.pillar, kind: "arm" }));
  PAINS.forEach((p) => p.sols.forEach((sid) => EDGES.push({ a: p.id, b: sid, kind: "addr" })));
  PAINS.forEach((p) => { if (!p.sols.length && p.pillar) EDGES.push({ a: p.id, b: p.pillar, kind: "painfocus" }); });
}
rebuildEdges();
export const ORIGINAL_SOLS = {};
PAINS.forEach((p) => (ORIGINAL_SOLS[p.id] = p.sols.slice()));
export const ORIGINAL_VERTS = {};
PAINS.forEach((p) => (ORIGINAL_VERTS[p.id] = (p.verts || []).slice()));
export const EDIT_PIN = "i3edit"; // change this to set the editor passcode

/* size each body by how much it encompasses */
export const lerp = (a, b, t) => a + (b - a) * Math.max(0, Math.min(1, t));
export const SOL_DEG = {}; SOLUTIONS.forEach((s) => (SOL_DEG[s.id] = 0));
PAINS.forEach((p) => p.sols.forEach((sid) => SOL_DEG[sid]++));
export const RADIUS = { core: 42 };
(() => {
  const pw = PILLARS.map((p) => SOLUTIONS.filter((s) => s.pillar === p.id).length);
  const pmn = Math.min(...pw), pmx = Math.max(...pw);
  PILLARS.forEach((p, i) => (RADIUS[p.id] = lerp(15, 24, (pw[i] - pmn) / ((pmx - pmn) || 1))));
  const sw = SOLUTIONS.map((s) => SOL_DEG[s.id]);
  const smn = Math.min(...sw), smx = Math.max(...sw);
  SOLUTIONS.forEach((s, i) => (RADIUS[s.id] = lerp(8, 13, (sw[i] - smn) / ((smx - smn) || 1))));
  const aw = PAINS.map((p) => p.sols.length + p.verts.length);
  const amn = Math.min(...aw), amx = Math.max(...aw);
  PAINS.forEach((p, i) => (RADIUS[p.id] = lerp(5, 9, (aw[i] - amn) / ((amx - amn) || 1))));
})();

export function relatedSet(id) {
  const n = NODE_BY_ID[id]; const s = new Set([id, "core"]); if (!n) return s;
  if (n.type === TYPE.CORE) return new Set(["core", ...PILLARS.map((p) => p.id)]);
  if (n.type === TYPE.PILLAR) SOLUTIONS.filter((x) => x.pillar === id).forEach((x) => { s.add(x.id); PAINS.filter((p) => p.sols.includes(x.id)).forEach((p) => s.add(p.id)); });
  else if (n.type === TYPE.SOLUTION) { s.add(n.pillar); PAINS.filter((p) => p.sols.includes(id)).forEach((p) => s.add(p.id)); }
  else { n.sols.forEach((sid) => { s.add(sid); s.add(NODE_BY_ID[sid].pillar); }); if (n.pillar) s.add(n.pillar); }
  return s;
}
export function pillarSet(pid) { const s = new Set([pid, "core"]); SOLUTIONS.filter((x) => x.pillar === pid).forEach((x) => { s.add(x.id); PAINS.filter((p) => p.sols.includes(x.id)).forEach((p) => s.add(p.id)); }); return s; }
export function verticalSet(vid) { const s = new Set(["core"]); PAINS.filter((p) => p.verts.includes(vid)).forEach((p) => { s.add(p.id); p.sols.forEach((sid) => { s.add(sid); s.add(NODE_BY_ID[sid].pillar); }); if (p.pillar) s.add(p.pillar); }); return s; }

/* fixed galaxy layout: pies by focus area — each node stores its sector + fractional position so sectors can fan open */
export function buildGalaxy() {
  const lay = { core: { ring: "core", angle: 0 } };
  const SOL_PILL = {}; SOLUTIONS.forEach((s) => (SOL_PILL[s.id] = s.pillar));
  const solBy = {}, painBy = {}; PILLARS.forEach((p) => { solBy[p.id] = SOLUTIONS.filter((s) => s.pillar === p.id); painBy[p.id] = []; });
  PAINS.forEach((p) => {
    let pl;
    if (p.sols.length) { const c = {}; p.sols.forEach((sid) => { const x = SOL_PILL[sid]; c[x] = (c[x] || 0) + 1; }); pl = Object.keys(c).sort((a, b) => c[b] - c[a])[0]; }
    else pl = p.pillar;
    if (!painBy[pl]) pl = PILLARS[0].id;
    painBy[pl].push(p);
  });
  const weights = PILLARS.map((p) => Math.max(painBy[p.id].length, solBy[p.id].length + 1, 2));
  PILLARS.forEach((p, i) => {
    lay[p.id] = { ring: "focus", sector: i, frac: 0.5 };
    const sols = solBy[p.id], fp = 0.16;
    sols.forEach((s, k) => { lay[s.id] = { ring: "sol", sector: i, frac: sols.length === 1 ? 0.5 : fp + (k / (sols.length - 1)) * (1 - 2 * fp) }; });
    const pains = painBy[p.id], pp = 0.07;
    pains.forEach((pn, k) => { lay[pn.id] = { ring: "pain", sector: i, frac: pains.length === 1 ? 0.5 : pp + (k / (pains.length - 1)) * (1 - 2 * pp) }; });
  });
  lay.__sectors = PILLARS.map((p, i) => ({ pillar: p.id, weight: weights[i] }));
  return lay;
}
export const GALAXY = buildGalaxy();

/* organized column layout once results are established: pain → solution → focus → i3Ai */
export const STAGE_X = { pain: 0.17, solution: 0.41, pillar: 0.66, core: 0.88 };
export const STAGE_REL = { pain: 0, solution: 0.34, pillar: 0.67, core: 1 };
export function colX(type, W) {
  const lm = Math.min(296, Math.max(W * 0.3, 200)); // left margin clears the control panel
  const rm = Math.min(90, W * 0.1);
  const band = Math.max(W - lm - rm, 160);
  return lm + band * STAGE_REL[type];
}
export function buildStage(ids) {
  const map = {};
  const visIds = new Set(ids);
  const pillarOrder = { P1: 0, P2: 1, P3: 2, P4: 3 };
  const domPillar = (p) => {
    if (!p.sols.length) return p.pillar || "P1";
    const cnt = {}; p.sols.forEach((sid) => { const pl = NODE_BY_ID[sid]?.pillar; if (pl) cnt[pl] = (cnt[pl] || 0) + 1; });
    return Object.entries(cnt).sort((x, y) => y[1] - x[1])[0]?.[0] || p.pillar || "P1";
  };

  // seed: group pains by dominant pillar, then by first shared solution
  let pains = ids.filter((id) => NODE_BY_ID[id].type === "pain");
  pains = pains.slice().sort((a, b) => {
    const pa = NODE_BY_ID[a], pb = NODE_BY_ID[b];
    const da = domPillar(pa), db = domPillar(pb);
    const od = (pillarOrder[da] ?? 9) - (pillarOrder[db] ?? 9);
    if (od !== 0) return od;
    const primA = pa.sols.filter((s) => visIds.has(s)).sort()[0] || "zzz";
    const primB = pb.sols.filter((s) => visIds.has(s)).sort()[0] || "zzz";
    return primA !== primB ? primA.localeCompare(primB) : pa.label.localeCompare(pb.label);
  });

  let sols = ids.filter((id) => NODE_BY_ID[id].type === "solution");
  let pillars = ids.filter((id) => NODE_BY_ID[id].type === "pillar");

  // barycentric crossing-minimisation: 4 sweeps
  for (let pass = 0; pass < 4; pass++) {
    // solutions → weighted mean of pain positions
    const painPos = Object.fromEntries(pains.map((id, k) => [id, k]));
    sols = sols.slice().sort((a, b) => {
      const bary = (id) => { const ps = pains.filter((pid) => NODE_BY_ID[pid].sols.filter((s) => visIds.has(s)).includes(id)); return ps.length ? ps.reduce((s, pid) => s + painPos[pid], 0) / ps.length : 999; };
      const diff = bary(a) - bary(b);
      return Math.abs(diff) > 0.01 ? diff : (pillarOrder[NODE_BY_ID[a]?.pillar] ?? 9) - (pillarOrder[NODE_BY_ID[b]?.pillar] ?? 9);
    });
    // pains → weighted mean of solution positions (keep pillar groups intact)
    const solPos = Object.fromEntries(sols.map((id, k) => [id, k]));
    pains = pains.slice().sort((a, b) => {
      const pa = NODE_BY_ID[a], pb = NODE_BY_ID[b];
      const da = domPillar(pa), db = domPillar(pb);
      const od = (pillarOrder[da] ?? 9) - (pillarOrder[db] ?? 9);
      if (od !== 0) return od;
      const bary = (p) => { const ss = p.sols.filter((s) => visIds.has(s)); return ss.length ? ss.reduce((s, sid) => s + (solPos[sid] ?? 0), 0) / ss.length : 999; };
      const diff = bary(pa) - bary(pb);
      return Math.abs(diff) > 0.01 ? diff : pa.label.localeCompare(pb.label);
    });
  }

  // focus areas → mean of their solution positions
  const solPos2 = Object.fromEntries(sols.map((id, k) => [id, k]));
  pillars = pillars.slice().sort((a, b) => {
    const bary = (pid) => { const ss = sols.filter((sid) => NODE_BY_ID[sid].pillar === pid); return ss.length ? ss.reduce((s, sid) => s + solPos2[sid], 0) / ss.length : 999; };
    return bary(a) - bary(b);
  });

  let lastDP = null;
  pains.forEach((id, k) => { const dp = domPillar(NODE_BY_ID[id]); const gf = dp !== lastDP; lastDP = dp; map[id] = { fx: STAGE_X.pain, slot: k, count: pains.length, type: "pain", domPillar: dp, groupFirst: gf }; });
  sols.forEach((id, k) => (map[id] = { fx: STAGE_X.solution, slot: k, count: sols.length, type: "solution" }));
  pillars.forEach((id, k) => (map[id] = { fx: STAGE_X.pillar, slot: k, count: pillars.length, type: "pillar" }));
  ids.filter((id) => NODE_BY_ID[id].type === "core").forEach((id) => (map[id] = { fx: STAGE_X.core, slot: 0, count: 1, type: "core" }));
  return map;
}

export function shade(hex, f) {
  const c = hex.replace("#", "");
  let r = parseInt(c.substr(0, 2), 16), g = parseInt(c.substr(2, 2), 16), b = parseInt(c.substr(4, 2), 16);
  if (f >= 0) { r += (255 - r) * f; g += (255 - g) * f; b += (255 - b) * f; }
  else { const k = 1 + f; r *= k; g *= k; b *= k; }
  return `rgb(${r | 0},${g | 0},${b | 0})`;
}
