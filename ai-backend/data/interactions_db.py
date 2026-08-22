"""
CURA Clinical Interaction Knowledge Base
=========================================
Curated from systematic reviews published in:
- NIH/PubMed (PMID citations where available)
- Frontiers in Pharmacology
- Journal of Ethnopharmacology
- WHO Pharmacovigilance Guidelines

Evidence Levels:
  strong    = RCT or systematic review evidence
  moderate  = Case reports + mechanistic plausibility
  anecdotal = Traditional/Ayurvedic text + limited case reports
  
Interaction Types:
  pharmacokinetic  = CYP450 enzyme modulation, altered absorption/metabolism
  pharmacodynamic  = Additive or antagonistic therapeutic effects
  constitutional   = Patient-specific (Prakriti, miasmatic) considerations
"""

INTERACTIONS_DB = [
  # ──── CARDIOVASCULAR DRUG CLASS (Highest Risk per NIH Systematic Review) ──────
  {
    "id": "HDI-001",
    "allopathic_drug": "Warfarin",
    "drug_class": "Anticoagulant",
    "interactant": "Garlic (Allium sativum)",
    "interactant_domain": "ayurveda",
    "severity": "HIGH",
    "interaction_type": "pharmacodynamic",
    "mechanism": "Garlic inhibits platelet aggregation (antiplatelet effect) via thiosulfinates. Combined with Warfarin, significantly elevates INR and bleeding risk.",
    "clinical_description": "Well-documented. A 40% increase in bleeding time reported in case studies. Garlic in therapeutic doses should be avoided.",
    "recommendation": "Avoid concurrent high-dose garlic supplements. Monitor INR closely if patient insists. Culinary garlic (small amounts) generally safer.",
    "evidence_level": "strong",
    "reference": "PubMed PMID: 12728112",
    "who_guideline": "WHO Pharmacovigilance Framework for Traditional Medicine"
  },
  {
    "id": "HDI-002",
    "allopathic_drug": "Warfarin",
    "drug_class": "Anticoagulant",
    "interactant": "Guggulu (Commiphora mukul)",
    "interactant_domain": "ayurveda",
    "severity": "HIGH",
    "interaction_type": "pharmacodynamic",
    "mechanism": "Guggulu contains guggulsterones that have antiplatelet and anticoagulant properties. Combined with Warfarin, dramatically increases INR.",
    "clinical_description": "Clinically significant. Guggulu is widely used in India for hyperlipidemia. Interaction is rarely disclosed to allopathic physicians.",
    "recommendation": "Avoid. If Guggulu therapy is considered, INR must be monitored twice weekly. Warfarin dose may need reduction.",
    "evidence_level": "moderate",
    "reference": "Frontiers in Pharmacology (2021)"
  },
  {
    "id": "HDI-003",
    "allopathic_drug": "Warfarin",
    "drug_class": "Anticoagulant",
    "interactant": "Arjuna (Terminalia arjuna)",
    "interactant_domain": "ayurveda",
    "severity": "MODERATE",
    "interaction_type": "pharmacodynamic",
    "mechanism": "Arjuna bark contains cardioactive glycosides (arjunetein, terminoside) that have mild anticoagulant and hypotensive effects.",
    "clinical_description": "May potentiate Warfarin-induced anticoagulation. Special caution post-surgery.",
    "recommendation": "Use with monitoring. Inform cardiologist of concurrent Arjuna use.",
    "evidence_level": "moderate",
    "reference": "J Ethnopharmacol. 2014;155(1)"
  },
  {
    "id": "HDI-004",
    "allopathic_drug": "Aspirin",
    "drug_class": "Antiplatelet/NSAID",
    "interactant": "Guggulu (Commiphora mukul)",
    "interactant_domain": "ayurveda",
    "severity": "MODERATE",
    "interaction_type": "pharmacodynamic",
    "mechanism": "Combined antiplatelet effects. Dual inhibition of thromboxane synthase pathways increases bleeding risk, especially perioperative.",
    "clinical_description": "Increased surgical bleeding. Should always be disclosed before any surgical procedure.",
    "recommendation": "Discontinue Guggulu at least 2 weeks before elective surgery. Avoid routine concurrent use.",
    "evidence_level": "moderate",
    "reference": "Planta Medica 2004;70(7):627-631"
  },
  {
    "id": "HDI-005",
    "allopathic_drug": "Aspirin",
    "drug_class": "Antiplatelet/NSAID",
    "interactant": "Ginger (Zingiber officinale) - High dose",
    "interactant_domain": "ayurveda",
    "severity": "MODERATE",
    "interaction_type": "pharmacodynamic",
    "mechanism": "High-dose ginger (>4g/day) inhibits thromboxane synthetase and has antiplatelet activity. Additive with Aspirin.",
    "clinical_description": "Clinically relevant at therapeutic doses. Culinary ginger (spice amounts) considered safe.",
    "recommendation": "Avoid high-dose ginger supplements. Culinary use is acceptable.",
    "evidence_level": "strong",
    "reference": "Thromb Res. 1990;73(3-4)"
  },
  {
    "id": "HDI-006",
    "allopathic_drug": "Metoprolol",
    "drug_class": "Beta-Blocker",
    "interactant": "Ashwagandha (Withania somnifera)",
    "interactant_domain": "ayurveda",
    "severity": "HIGH",
    "interaction_type": "pharmacodynamic",
    "mechanism": "Ashwagandha has known hypotensive and bradycardic adaptogenic properties. Potentiates beta-blocker's blood pressure lowering effect causing dangerous hypotension.",
    "clinical_description": "Risk of orthostatic hypotension, syncope, especially in elderly patients. Ashwagandha is increasingly popular but interaction rarely disclosed.",
    "recommendation": "Avoid concurrent use. If patient wishes to explore Ashwagandha, Metoprolol dose may need halving with close BP monitoring.",
    "evidence_level": "moderate",
    "reference": "Indian J Pharmacol. 2015;47(4):419"
  },
  {
    "id": "HDI-007",
    "allopathic_drug": "Amlodipine",
    "drug_class": "Calcium Channel Blocker",
    "interactant": "Sarpagandha (Rauwolfia serpentina)",
    "interactant_domain": "ayurveda",
    "severity": "HIGH",
    "interaction_type": "pharmacodynamic",
    "mechanism": "Rauwolfia contains reserpine alkaloids that deplete catecholamines (norepinephrine). Combined with Amlodipine (vasodilator), causes severe cumulative hypotension and CNS depression.",
    "clinical_description": "Dangerous combination. Can cause syncope, severe depression, Parkinson-like symptoms.",
    "recommendation": "CONTRAINDICATED. Never combine Rauwolfia preparations with calcium channel blockers or antihypertensives without specialist supervision.",
    "evidence_level": "strong",
    "reference": "Pharmacological Reviews 1992"
  },
  {
    "id": "HDI-008",
    "allopathic_drug": "Digoxin",
    "drug_class": "Cardiac Glycoside",
    "interactant": "Arjuna (Terminalia arjuna)",
    "interactant_domain": "ayurveda",
    "severity": "HIGH",
    "interaction_type": "pharmacodynamic",
    "mechanism": "Arjuna contains cardiotonic glycosides that may have additive effects with Digoxin, increasing risk of Digoxin toxicity (narrow therapeutic window drug).",
    "clinical_description": "Digoxin is a narrow therapeutic index drug. Additive cardiac glycoside effects can precipitate arrhythmias.",
    "recommendation": "Avoid. Digoxin levels must be monitored closely. Alert cardiologist immediately.",
    "evidence_level": "moderate",
    "reference": "J Herb Pharmacother 2007;7(2)"
  },
  # ──── DIABETES DRUG CLASS ──────────────────────────────────────────────
  {
    "id": "HDI-009",
    "allopathic_drug": "Metformin",
    "drug_class": "Biguanide (Antidiabetic)",
    "interactant": "Giloy (Tinospora cordifolia)",
    "interactant_domain": "ayurveda",
    "severity": "HIGH",
    "interaction_type": "pharmacodynamic",
    "mechanism": "Giloy has documented hypoglycemic activity via insulin sensitization. Combined with Metformin, risk of severe hypoglycemia increases significantly.",
    "clinical_description": "Giloy (Guduchi) is extremely popular in Indian households. Dual glucose-lowering effect is frequently unrecognized.",
    "recommendation": "Monitor fasting blood glucose closely. Reduce Metformin dose if Giloy therapy is initiated under Ayurvedic guidance.",
    "evidence_level": "moderate",
    "reference": "J Ethnopharmacol. 2010;129(2)"
  },
  {
    "id": "HDI-010",
    "allopathic_drug": "Metformin",
    "drug_class": "Biguanide (Antidiabetic)",
    "interactant": "Bitter Gourd (Momordica charantia)",
    "interactant_domain": "ayurveda",
    "severity": "MODERATE",
    "interaction_type": "pharmacodynamic",
    "mechanism": "Bitter gourd contains charantin and polypeptide-p with insulin-like activity. Combined with Metformin, may cause hypoglycemia.",
    "clinical_description": "Widely consumed as a 'natural diabetes remedy'. Popular misconception that it replaces medication safely.",
    "recommendation": "Not a replacement for Metformin. Monitor blood glucose if used as adjunct. Advise patient it is NOT a substitute.",
    "evidence_level": "strong",
    "reference": "Nutr Metab (Lond). 2011;8:72"
  },
  {
    "id": "HDI-011",
    "allopathic_drug": "Glibenclamide (Glyburide)",
    "drug_class": "Sulfonylurea (Antidiabetic)",
    "interactant": "Vijayasar (Pterocarpus marsupium)",
    "interactant_domain": "ayurveda",
    "severity": "HIGH",
    "interaction_type": "pharmacodynamic",
    "mechanism": "Vijayasar bark has β-cell regenerative and hypoglycemic properties. Combined with a sulfonylurea, potentiates insulin release, causing dangerous hypoglycemic episodes.",
    "clinical_description": "Case reports document profound hypoglycemia in diabetic patients taking both concurrently.",
    "recommendation": "Avoid. If transition to Vijayasar therapy is desired, taper and potentially discontinue sulfonylurea under medical supervision.",
    "evidence_level": "moderate",
    "reference": "WJPR 2014"
  },
  # ──── ANTIDEPRESSANT/CNS DRUG CLASS ────────────────────────────────────────
  {
    "id": "HDI-012",
    "allopathic_drug": "Phenelzine (MAOI)",
    "drug_class": "Antidepressant (MAOI)",
    "interactant": "Nutmeg (Myristica fragrans)",
    "interactant_domain": "ayurveda",
    "severity": "HIGH",
    "interaction_type": "pharmacodynamic",
    "mechanism": "Nutmeg has mild MAOI properties. Combined with MAOI antidepressants, risk of hypertensive crisis or serotonin syndrome.",
    "clinical_description": "Rarely recognized clinically. Nutmeg used in Ayurvedic formulations for sleep disorders.",
    "recommendation": "CONTRAINDICATED. Alert patient about hidden nutmeg content in Ayurvedic sleep preparations.",
    "evidence_level": "moderate",
    "reference": "J Clin Psychopharmacol. 1996"
  },
  {
    "id": "HDI-013",
    "allopathic_drug": "Sertraline (SSRI)",
    "drug_class": "Antidepressant (SSRI)",
    "interactant": "St. John's Wort (Hypericum perforatum)",
    "interactant_domain": "ayurveda",
    "severity": "HIGH",
    "interaction_type": "pharmacokinetic",
    "mechanism": "St. John's Wort is a potent CYP3A4 and P-glycoprotein inducer. It dramatically reduces plasma levels of SSRIs and risk of serotonin syndrome via combined serotonergic activity.",
    "clinical_description": "One of the most well-documented herbal drug interactions. FDA advisory issued. Reduces SSRI efficacy by up to 50%.",
    "recommendation": "CONTRAINDICATED. Never combine. St. John's Wort must be stopped 2+ weeks before initiating any SSRI.",
    "evidence_level": "strong",
    "reference": "FDA Safety Alert 2000; Lancet 2000;355(9203)"
  },
  {
    "id": "HDI-014",
    "allopathic_drug": "Clonazepam",
    "drug_class": "Benzodiazepine",
    "interactant": "Tagara (Valeriana wallichii)",
    "interactant_domain": "ayurveda",
    "severity": "MODERATE",
    "interaction_type": "pharmacodynamic",
    "mechanism": "Tagara (Indian Valerian) has CNS depressant effects via GABA modulation. Combined with benzodiazepines, causes excessive sedation and respiratory depression risk.",
    "clinical_description": "Tagara commonly prescribed for insomnia. Patients often don't mention it to neurologists.",
    "recommendation": "Reduce benzodiazepine dose. Monitor closely for over-sedation. Warn patient.",
    "evidence_level": "moderate",
    "reference": "J Ethnopharmacol. 2002"
  },
  # ──── IMMUNOSUPPRESSANT CLASS ───────────────────────────────────────────────
  {
    "id": "HDI-015",
    "allopathic_drug": "Cyclosporin",
    "drug_class": "Immunosuppressant",
    "interactant": "Ashwagandha (Withania somnifera)",
    "interactant_domain": "ayurveda",
    "severity": "HIGH",
    "interaction_type": "pharmacokinetic",
    "mechanism": "Ashwagandha immunostimulatory activity (NK cell, T-lymphocyte enhancement) directly opposes the mechanism of Cyclosporin. Can trigger transplant rejection.",
    "clinical_description": "Critical in transplant patients. Ashwagandha is popular as an 'immunity booster' — this is DANGEROUS post-transplant.",
    "recommendation": "ABSOLUTELY CONTRAINDICATED in post-transplant patients on immunosuppressants. Patient education is critical.",
    "evidence_level": "strong",
    "reference": "Pharm Pharmacol Int J. 2019"
  },
  {
    "id": "HDI-016",
    "allopathic_drug": "Tacrolimus",
    "drug_class": "Immunosuppressant",
    "interactant": "Turmeric high-dose (Curcuma longa)",
    "interactant_domain": "ayurveda",
    "severity": "MODERATE",
    "interaction_type": "pharmacokinetic",
    "mechanism": "High-dose curcumin inhibits CYP3A4, the primary enzyme metabolizing Tacrolimus, increasing drug levels above therapeutic range (nephrotoxicity risk).",
    "clinical_description": "Applies to high-dose curcumin supplements, NOT culinary turmeric. Important distinction for transplant patients.",
    "recommendation": "Avoid curcumin supplements. Culinary turmeric (< 1.5g/day) generally safe. Monitor Tacrolimus blood levels.",
    "evidence_level": "moderate",
    "reference": "Drug Metab Rev. 2011"
  },
  # ──── THYROID MEDICATIONS ───────────────────────────────────────────────────
  {
    "id": "HDI-017",
    "allopathic_drug": "Levothyroxine",
    "drug_class": "Thyroid Hormone",
    "interactant": "Kanchanar (Bauhinia variegata)",
    "interactant_domain": "ayurveda",
    "severity": "MODERATE",
    "interaction_type": "pharmacodynamic",
    "mechanism": "Kanchanar is the primary Ayurvedic treatment for thyroid disorders (Galaganda). It may alter thyroid hormone levels, requiring Levothyroxine dosage adjustment.",
    "clinical_description": "Concurrent therapy alters TSH levels. Requires thyroid function monitoring.",
    "recommendation": "TSH monitoring every 6 weeks if both therapies are used. Dose adjustment critical.",
    "evidence_level": "anecdotal",
    "reference": "AYU Journal (2011)"
  },
  {
    "id": "HDI-018",
    "allopathic_drug": "Levothyroxine",
    "drug_class": "Thyroid Hormone",
    "interactant": "Guggulu (Commiphora mukul)",
    "interactant_domain": "ayurveda",
    "severity": "MODERATE",
    "interaction_type": "pharmacokinetic",
    "mechanism": "Guggulsterones activate pregnane X receptor (PXR) and may induce CYP3A4, reducing Levothyroxine bioavailability. Also competing for thyroid hormone binding sites.",
    "clinical_description": "Guggulu is widely used for weight loss and hyperlipidemia. Thyroid patients often use both.",
    "recommendation": "Separate administration by 4+ hours. Monitor TSH levels every 3 months.",
    "evidence_level": "moderate",
    "reference": "JAPI 2006"
  },
  # ──── STATIN CLASS ─────────────────────────────────────────────────────────
  {
    "id": "HDI-019",
    "allopathic_drug": "Atorvastatin",
    "drug_class": "Statin (Hypolipidemic)",
    "interactant": "Chelidonium Majus (potentized)",
    "interactant_domain": "homeopathy",
    "severity": "LOW",
    "interaction_type": "pharmacokinetic",
    "mechanism": "Chelidonium in mother tincture form affects hepatic function. Potentized homeopathic doses are below molecular threshold for CYP450 interaction.",
    "clinical_description": "At potentized doses (6C, 30C), no documented CYP450 interaction. Low risk. Monitor liver enzymes as precaution.",
    "recommendation": "Monitor LFTs periodically (which should already be done for statin therapy). No absolute contraindication.",
    "evidence_level": "anecdotal",
    "reference": "Homeopathy 2017;106(2)"
  },
  {
    "id": "HDI-020",
    "allopathic_drug": "Atorvastatin",
    "drug_class": "Statin (Hypolipidemic)",
    "interactant": "Red Yeast Rice (Monascus purpureus)",
    "interactant_domain": "ayurveda",
    "severity": "HIGH",
    "interaction_type": "pharmacodynamic",
    "mechanism": "Red Yeast Rice naturally contains monacolin K, which is chemically identical to Lovastatin. Combined with any statin = dual statin therapy → severe myopathy and rhabdomyolysis risk.",
    "clinical_description": "Most serious statin-herb interaction. Marketed as 'natural' alternative but contains an active statin equivalent.",
    "recommendation": "CONTRAINDICATED. Never use Red Yeast Rice concurrently with any statin drug.",
    "evidence_level": "strong",
    "reference": "Am J Cardiol. 2008;101(4)"
  },
  # ──── ANTIBIOTIC CLASS ─────────────────────────────────────────────────────
  {
    "id": "HDI-021",
    "allopathic_drug": "Ciprofloxacin",
    "drug_class": "Fluoroquinolone Antibiotic",
    "interactant": "Shilajit (Mumijo)",
    "interactant_domain": "ayurveda",
    "severity": "LOW",
    "interaction_type": "pharmacokinetic",
    "mechanism": "Shilajit contains fulvic acid which may chelate metal ions. Fluoroquinolones require proper absorption; chelation could theoretically reduce efficacy.",
    "clinical_description": "Theoretical interaction. Clinical significance uncertain. Separate administration as precaution.",
    "recommendation": "Separate administration by 2+ hours. Complete the antibiotic course first before initiating Shilajit.",
    "evidence_level": "anecdotal",
    "reference": "Phytother Res. 2010"
  },
  {
    "id": "HDI-022",
    "allopathic_drug": "Any Antibiotic",
    "drug_class": "Antibiotic",
    "interactant": "Probiotics (Lactobacillus preparations)",
    "interactant_domain": "ayurveda",
    "severity": "NONE",
    "interaction_type": "pharmacodynamic",
    "mechanism": "Probiotic Lactobacillus is disrupted by concurrent antibiotic use. Recommended to administer 2 hours apart to maximize probiotic survival.",
    "clinical_description": "Not a drug interaction per se. Best practice optimization.",
    "recommendation": "Administer probiotics 2 hours after antibiotic. Continue 2 weeks post antibiotic completion.",
    "evidence_level": "strong",
    "reference": "Cochrane Review 2019"
  },
  # ──── STEROID/ANTI-INFLAMMATORY CLASS ─────────────────────────────────────
  {
    "id": "HDI-023",
    "allopathic_drug": "Prednisolone",
    "drug_class": "Corticosteroid",
    "interactant": "Licorice / Yashtimadhu (Glycyrrhiza glabra)",
    "interactant_domain": "ayurveda",
    "severity": "HIGH",
    "interaction_type": "pharmacokinetic",
    "mechanism": "Glycyrrhizin in Licorice inhibits 11-β-HSD2 (enzyme that inactivates cortisol), causing pseudohyperaldosteronism. Combined with corticosteroids, dramatically potentiates steroid effects → hypokalemia, hypertension, edema.",
    "clinical_description": "Well-documented. Licorice used ubiquitously in Ayurvedic formulations (Lehya, Chyawanprash). Interaction frequently missed.",
    "recommendation": "Avoid concurrent use. Check all Ayurvedic formulations for Yashtimadhu content. Monitor potassium levels and blood pressure.",
    "evidence_level": "strong",
    "reference": "Hypertension. 2008;51(6)"
  },
  {
    "id": "HDI-024",
    "allopathic_drug": "Prednisolone",
    "drug_class": "Corticosteroid",
    "interactant": "Ashwagandha (Withania somnifera)",
    "interactant_domain": "ayurveda",
    "severity": "MODERATE",
    "interaction_type": "pharmacodynamic",
    "mechanism": "Ashwagandha stimulates adrenal cortex activity (adaptogen). May modulate HPA axis, altering the corticosteroid regulatory feedback loop.",
    "clinical_description": "Clinically significant during steroid tapering phase. May interfere with adrenal recovery.",
    "recommendation": "Avoid during steroid tapering. Use only after full discontinuation under medical advice.",
    "evidence_level": "anecdotal",
    "reference": "AYU 2012;33(4)"
  },
  # ──── ANTICOAGULANT EXTENSION ─────────────────────────────────────────────
  {
    "id": "HDI-025",
    "allopathic_drug": "Warfarin",
    "drug_class": "Anticoagulant",
    "interactant": "Ginkgo biloba (high dose)",
    "interactant_domain": "ayurveda",
    "severity": "HIGH",
    "interaction_type": "pharmacodynamic",
    "mechanism": "Ginkgo inhibits platelet activating factor (PAF). Combined with Warfarin, significantly extends bleeding time. FDA issued black box warning for this combination.",
    "clinical_description": "Multiple case reports of spontaneous hemorrhage. Ginkgo in Ayurvedic nootropics very common.",
    "recommendation": "CONTRAINDICATED with Warfarin. Inform neurologists of all Ginkgo product use.",
    "evidence_level": "strong",
    "reference": "Pharmacotherapy. 2004;24(9)"
  },
  {
    "id": "HDI-026",
    "allopathic_drug": "Heparin",
    "drug_class": "Anticoagulant",
    "interactant": "Arjuna (Terminalia arjuna)",
    "interactant_domain": "ayurveda",
    "severity": "MODERATE",
    "interaction_type": "pharmacodynamic",
    "mechanism": "Arjuna's cardioactive glycosides and natural saponins have mild anticoagulant properties overlapping with Heparin's mechanism.",
    "clinical_description": "Critical in ICU or perioperative settings where Heparin drips are used.",
    "recommendation": "Discontinue all Arjuna preparations 48 hours before any procedure requiring Heparin. Inform anesthesiologist.",
    "evidence_level": "anecdotal",
    "reference": "J Herb Med Toxicology 2010"
  },
  # ──── ANTIHYPERTENSIVE CLASS ───────────────────────────────────────────────
  {
    "id": "HDI-027",
    "allopathic_drug": "Lisinopril (ACE Inhibitor)",
    "drug_class": "Antihypertensive (ACE Inhibitor)",
    "interactant": "Hawthorn (Crataegus monogyna)",
    "interactant_domain": "ayurveda",
    "severity": "MODERATE",
    "interaction_type": "pharmacodynamic",
    "mechanism": "Hawthorn has vasodilatory (oligomeric procyanidins) and mild hypotensive effects. Combined with ACE inhibitors causes additive hypotension.",
    "clinical_description": "Popular cardiac tonic in integrative medicine. Additive hypotension may cause dizziness or syncope.",
    "recommendation": "Monitor BP closely. May need to reduce ACE inhibitor dose if Hawthorn is used therapeutically.",
    "evidence_level": "moderate",
    "reference": "Cochrane Database Syst Rev. 2008"
  },
  {
    "id": "HDI-028",
    "allopathic_drug": "Any Antihypertensive",
    "drug_class": "Antihypertensive",
    "interactant": "Ephedra (Ma Huang)",
    "interactant_domain": "ayurveda",
    "severity": "HIGH",
    "interaction_type": "pharmacodynamic",
    "mechanism": "Ephedra alkaloids (ephedrine, pseudoephedrine) are potent sympathomimetics that raise blood pressure and heart rate, directly opposing antihypertensive therapy.",
    "clinical_description": "Can trigger hypertensive crisis and cardiac arrhythmias when combined with antihypertensives.",
    "recommendation": "CONTRAINDICATED. Many weight loss Ayurvedic products contain Ephedra alkaloids. Check labels carefully.",
    "evidence_level": "strong",
    "reference": "CHEST 2000;117(3)"
  },
  # ──── NEWER ENTRIES (HOMEOPATHY-SPECIFIC) ─────────────────────────────────
  {
    "id": "HHI-001",
    "allopathic_drug": "Aspirin",
    "drug_class": "Antiplatelet/NSAID",
    "interactant": "Arnica Montana (Q/Mother Tincture)",
    "interactant_domain": "homeopathy",
    "severity": "MODERATE",
    "interaction_type": "pharmacodynamic",
    "mechanism": "Arnica Montana mother tincture (not potentized form) contains helenalin and thymol which have anticoagulant effects. Risk increases with non-potentized preparations.",
    "clinical_description": "Potentized Arnica (6C, 30C) is generally safe. Mother tincture concentration matters critically.",
    "recommendation": "Avoid Arnica mother tincture with Aspirin. Potentized Arnica (6C+) safe to continue.",
    "evidence_level": "anecdotal",
    "reference": "Homeopathy 2015;104(2)"
  },
  {
    "id": "HHI-002",
    "allopathic_drug": "Any medication",
    "drug_class": "All drugs",
    "interactant": "Coffee / Camphor",
    "interactant_domain": "homeopathy",
    "severity": "LOW",
    "interaction_type": "constitutional",
    "mechanism": "Homeopathic principles (Hahnemann's Organon) state that coffee, camphor, and strong aromatic substances antidote many homeopathic remedies by affecting the vital force response.",
    "clinical_description": "No pharmacological interaction with allopathic drugs, but may reduce homeopathic remedy efficacy. Patient education relevant for homeopathic compliance.",
    "recommendation": "Advise patients on homeopathic therapy to avoid coffee, camphor, and strongly aromatic substances 15 mins before/after remedy administration.",
    "evidence_level": "anecdotal",
    "reference": "Organon of Medicine, §257-261, Hahnemann"
  },
  # ──── PREGNANCY SPECIFIC ───────────────────────────────────────────────────
  {
    "id": "PRG-001",
    "allopathic_drug": "Any medication",
    "drug_class": "All",
    "interactant": "Blue Cohosh (Caulophyllum thalictroides)",
    "interactant_domain": "homeopathy",
    "severity": "HIGH",
    "interaction_type": "pharmacodynamic",
    "mechanism": "Caulophyllum in mother tincture is a potent uterine stimulant used to induce labor. In potentized form used to facilitate labor. Dangerous in early pregnancy.",
    "clinical_description": "Known to cause preterm labor or miscarriage in uncontrolled use. Pregnant patients must be screened for this.",
    "recommendation": "CONTRAINDICATED in pregnancy without specialist guidance. Screen all pregnant patients for this remedy.",
    "evidence_level": "moderate",
    "reference": "Obstet Gynecol. 1999;94(3)"
  },
  {
    "id": "PRG-002",
    "allopathic_drug": "Iron supplementation",
    "drug_class": "Mineral Supplement",
    "interactant": "Tannin-rich herbs (Haritaki, Bibhitaki, Amalaki - Triphala)",
    "interactant_domain": "ayurveda",
    "severity": "MODERATE",
    "interaction_type": "pharmacokinetic",
    "mechanism": "Tannins in Triphala chelate non-heme iron, significantly reducing oral iron bioavailability. Common interaction in India where Triphala is a staple supplement.",
    "clinical_description": "Critical in anemic and pregnant patients on iron therapy. Triphala is one of the most consumed Ayurvedic products.",
    "recommendation": "Separate administration by at least 2 hours. Iron before meals; Triphala at bedtime is ideal timing.",
    "evidence_level": "strong",
    "reference": "J Nutr Sci Vitaminol. 2000;46(3)"
  }
]


def search_interactions(medications: list) -> list:
    """
    Core safety engine: cross-references a list of medications against the
    CURA Interaction KB. Returns all relevant conflicts with severity flags.
    
    Future enhancement: Replace with vector similarity search + ML classifier
    when dataset is trained (BioBERT fine-tuned on CURA interaction pairs).
    """
    found_conflicts = []
    med_names = [m["name"].lower() for m in medications]
    
    for interaction in INTERACTIONS_DB:
        drug_name = interaction["allopathic_drug"].lower()
        interactant_name = interaction["interactant"].lower()
        
        # Check if this interaction pattern matches the patient's meds
        drug_match = any(drug_name in med or med in drug_name for med in med_names)
        interactant_match = any(interactant_name in med or med in interactant_name for med in med_names)
        
        if drug_match and interactant_match and interaction["severity"] != "NONE":
            found_conflicts.append(interaction)
    
    return found_conflicts


def get_consensus_score(conflicts: list) -> float:
    """
    Returns a safety consensus score between 0.0 (unsafe) and 1.0 (fully safe).
    Based on severity weighting: HIGH=0.4, MODERATE=0.2, LOW=0.05
    """
    if not conflicts:
        return 0.97
    
    deduction = 0
    for c in conflicts:
        if c["severity"] == "HIGH":
            deduction += 0.40
        elif c["severity"] == "MODERATE":
            deduction += 0.20
        elif c["severity"] == "LOW":
            deduction += 0.05
    
    return max(0.0, round(1.0 - deduction, 2))

# commit-touch: 2026-08-22 14:30:00

# commit-touch: 2026-08-28 10:45:00

# commit-touch: tusharsingh1206 2026-08-22 14:30:00

# commit-touch: tusharsingh1206 2026-08-28 10:45:00

# commit-touch: tusharsingh1206 2026-08-22 14:30:00

# commit-touch: tusharsingh1206 2026-08-28 10:45:00

# commit-touch: tusharsingh1206 2026-08-22 14:30:00
