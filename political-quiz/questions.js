// Question banks for the Political Compass Quiz.
//
// Every answer carries a score from -2 to +2:
//   Ideology round:  negative = liberal,   positive = conservative
//   Party round:     negative = Democrat,  positive = Republican
//
// Answer order is shuffled at runtime, so the order written here doesn't matter.

const IDEOLOGY_QUESTIONS = [
  {
    text: "How involved should the federal government be in providing health care?",
    answers: [
      { text: "It should guarantee health coverage for everyone, such as a single-payer system.", score: -2 },
      { text: "It should expand public options and subsidies while keeping private insurance.", score: -1 },
      { text: "It should play a limited role and encourage market competition.", score: 1 },
      { text: "Health care should be left to individuals, employers, and the private market.", score: 2 },
    ],
  },
  {
    text: "What is your view on gun laws?",
    answers: [
      { text: "We need much stricter laws, including bans on assault-style weapons.", score: -2 },
      { text: "Universal background checks and red-flag laws are reasonable steps.", score: -1 },
      { text: "Current laws are mostly enough; enforce what's already on the books.", score: 1 },
      { text: "Gun ownership is a fundamental right and restrictions should be loosened.", score: 2 },
    ],
  },
  {
    text: "How should the U.S. approach immigration?",
    answers: [
      { text: "Offer a broad path to citizenship and expand legal immigration.", score: -2 },
      { text: "Combine border security with a path to citizenship for long-term residents.", score: -1 },
      { text: "Prioritize border enforcement before any other reforms.", score: 1 },
      { text: "Greatly reduce immigration and deport those here illegally.", score: 2 },
    ],
  },
  {
    text: "What should happen to taxes on high earners and corporations?",
    answers: [
      { text: "Raise them significantly to fund social programs.", score: -2 },
      { text: "Raise them modestly so everyone pays a fair share.", score: -1 },
      { text: "Keep them about where they are.", score: 1 },
      { text: "Cut them to encourage investment and economic growth.", score: 2 },
    ],
  },
  {
    text: "How should the country address climate change?",
    answers: [
      { text: "Aggressively — rapidly phase out fossil fuels with major government action.", score: -2 },
      { text: "Invest in clean energy and set gradual emissions targets.", score: -1 },
      { text: "Let innovation and the market lead, with minimal new regulation.", score: 1 },
      { text: "Climate regulations hurt the economy; expand domestic oil and gas.", score: 2 },
    ],
  },
  {
    text: "Which statement best describes your view on abortion?",
    answers: [
      { text: "It should be legal in all or nearly all cases.", score: -2 },
      { text: "It should be legal in most cases, with some limits later in pregnancy.", score: -1 },
      { text: "It should be illegal in most cases, with some exceptions.", score: 1 },
      { text: "It should be illegal in all or nearly all cases.", score: 2 },
    ],
  },
  {
    text: "What should the minimum wage be?",
    answers: [
      { text: "Raise the federal minimum wage to $20 an hour or more.", score: -2 },
      { text: "Raise it gradually and tie it to inflation.", score: -1 },
      { text: "Let states and cities set their own minimum wages.", score: 1 },
      { text: "There should be no minimum wage; let the market decide.", score: 2 },
    ],
  },
  {
    text: "How should police departments be handled?",
    answers: [
      { text: "Shift significant funding from police to social services.", score: -2 },
      { text: "Keep funding but add more oversight and accountability reforms.", score: -1 },
      { text: "Support police with more training and resources.", score: 1 },
      { text: "Increase police funding and give officers more support to enforce the law.", score: 2 },
    ],
  },
  {
    text: "What role should the government play in reducing income inequality?",
    answers: [
      { text: "A major role — through wealth taxes and strong social safety nets.", score: -2 },
      { text: "Some role — through education, job training, and targeted programs.", score: -1 },
      { text: "A small role — economic growth helps everyone more than redistribution.", score: 1 },
      { text: "No role — it's not the government's job to equalize outcomes.", score: 2 },
    ],
  },
  {
    text: "How do you feel about student loan debt?",
    answers: [
      { text: "Cancel most or all of it and make public college tuition-free.", score: -2 },
      { text: "Forgive some debt and lower interest rates.", score: -1 },
      { text: "Borrowers should repay, but colleges should be held accountable for costs.", score: 1 },
      { text: "Borrowers agreed to the loans and should repay them in full.", score: 2 },
    ],
  },
  {
    text: "What is the best way to reduce crime?",
    answers: [
      { text: "Address root causes like poverty, housing, and mental health.", score: -2 },
      { text: "Mix prevention programs with smart, fair enforcement.", score: -1 },
      { text: "Stronger enforcement and consistent prosecution.", score: 1 },
      { text: "Tougher sentences and a zero-tolerance approach.", score: 2 },
    ],
  },
  {
    text: "How big should the federal government be?",
    answers: [
      { text: "Bigger — it should do more to solve society's problems.", score: -2 },
      { text: "About the same, but more effective.", score: -1 },
      { text: "Somewhat smaller, with more power returned to the states.", score: 1 },
      { text: "Much smaller — it does too much already.", score: 2 },
    ],
  },
  {
    text: "Which best describes your view on same-sex marriage?",
    answers: [
      { text: "Strongly support; it should be protected by federal law.", score: -2 },
      { text: "Support it as settled law.", score: -1 },
      { text: "It should be up to the states to decide.", score: 1 },
      { text: "Marriage should be defined as between a man and a woman.", score: 2 },
    ],
  },
  {
    text: "How should the country handle voting rules?",
    answers: [
      { text: "Expand access: automatic registration, mail voting for all, no ID required.", score: -2 },
      { text: "Make voting easier while keeping basic safeguards.", score: -1 },
      { text: "Require voter ID and keep voter rolls tightly maintained.", score: 1 },
      { text: "Strict ID laws, limited mail voting, and in-person voting on Election Day.", score: 2 },
    ],
  },
  {
    text: "What's your view on labor unions?",
    answers: [
      { text: "Unions are essential and should be much easier to form.", score: -2 },
      { text: "Unions generally help workers and deserve support.", score: -1 },
      { text: "Unions are sometimes useful but often go too far.", score: 1 },
      { text: "Right-to-work laws are better; unions hurt businesses.", score: 2 },
    ],
  },
  {
    text: "How should schools handle curriculum decisions?",
    answers: [
      { text: "Educators and experts should set curriculum, including diverse perspectives.", score: -2 },
      { text: "Educators should lead, with input from parents.", score: -1 },
      { text: "Parents should have a strong say and be able to review materials.", score: 1 },
      { text: "Parents should control curriculum, with broad school choice and vouchers.", score: 2 },
    ],
  },
  {
    text: "What's your view on government regulation of businesses?",
    answers: [
      { text: "Much more regulation is needed to protect workers, consumers, and the environment.", score: -2 },
      { text: "Some added regulation is needed in specific industries.", score: -1 },
      { text: "Regulations should be reduced to help businesses grow.", score: 1 },
      { text: "Most regulations should be eliminated; the free market works best.", score: 2 },
    ],
  },
  {
    text: "How should the U.S. approach its military spending?",
    answers: [
      { text: "Cut it significantly and invest the savings at home.", score: -2 },
      { text: "Trim it modestly and cut waste.", score: -1 },
      { text: "Keep it strong at roughly current levels.", score: 1 },
      { text: "Increase it — a strong military keeps us safe.", score: 2 },
    ],
  },
  {
    text: "What role should religion play in public life?",
    answers: [
      { text: "Strict separation of church and state in all public institutions.", score: -2 },
      { text: "Religion is a private matter, but expression is fine in public.", score: -1 },
      { text: "Religious values are an important foundation for public life.", score: 1 },
      { text: "The nation's laws should reflect traditional religious values.", score: 2 },
    ],
  },
  {
    text: "How should social welfare programs (like food assistance) work?",
    answers: [
      { text: "Expand them and make them easier to access.", score: -2 },
      { text: "Keep them, and improve how they're run.", score: -1 },
      { text: "Add work requirements and tighten eligibility.", score: 1 },
      { text: "Cut them back and rely more on charities and communities.", score: 2 },
    ],
  },
  {
    text: "What's your view on recreational marijuana?",
    answers: [
      { text: "Legalize it nationwide and expunge past convictions.", score: -2 },
      { text: "Decriminalize it and let states decide on legalization.", score: -1 },
      { text: "Keep it limited to medical use.", score: 1 },
      { text: "Keep it illegal.", score: 2 },
    ],
  },
  {
    text: "How should the U.S. handle international trade?",
    answers: [
      { text: "Trade deals must include strong labor and environmental protections.", score: -2 },
      { text: "Support free trade with fair rules for workers.", score: -1 },
      { text: "Use tariffs selectively to protect American industry.", score: 1 },
      { text: "Put America first with broad tariffs and fewer trade deals.", score: 2 },
    ],
  },
  {
    text: "Which describes your view on affirmative action and diversity programs?",
    answers: [
      { text: "They're necessary to correct historical inequalities and should be expanded.", score: -2 },
      { text: "They're helpful when done carefully.", score: -1 },
      { text: "They should be scaled back in favor of merit-based decisions.", score: 1 },
      { text: "They should be eliminated entirely.", score: 2 },
    ],
  },
  {
    text: "How do you view the phrase \"traditional values\"?",
    answers: [
      { text: "It often excludes people; society should keep evolving.", score: -2 },
      { text: "Some traditions are worth keeping, others should change.", score: -1 },
      { text: "Traditional values provide important stability.", score: 1 },
      { text: "Restoring traditional values is essential for the country.", score: 2 },
    ],
  },
];

const PARTY_QUESTIONS = [
  {
    text: "In most elections, whose candidates do you find yourself supporting?",
    answers: [
      { text: "Almost always Democrats.", score: -2 },
      { text: "Usually Democrats.", score: -1 },
      { text: "Usually Republicans.", score: 1 },
      { text: "Almost always Republicans.", score: 2 },
    ],
  },
  {
    text: "Which party do you think better handles the economy?",
    answers: [
      { text: "Definitely the Democratic Party.", score: -2 },
      { text: "Probably the Democratic Party.", score: -1 },
      { text: "Probably the Republican Party.", score: 1 },
      { text: "Definitely the Republican Party.", score: 2 },
    ],
  },
  {
    text: "Which party's values are closer to your own?",
    answers: [
      { text: "The Democratic Party's, by a lot.", score: -2 },
      { text: "The Democratic Party's, slightly.", score: -1 },
      { text: "The Republican Party's, slightly.", score: 1 },
      { text: "The Republican Party's, by a lot.", score: 2 },
    ],
  },
  {
    text: "Which party do you trust more on national security?",
    answers: [
      { text: "Democrats, clearly.", score: -2 },
      { text: "Democrats, somewhat.", score: -1 },
      { text: "Republicans, somewhat.", score: 1 },
      { text: "Republicans, clearly.", score: 2 },
    ],
  },
  {
    text: "Which party would you rather control Congress?",
    answers: [
      { text: "Democrats — and with a large majority.", score: -2 },
      { text: "Democrats, but a divided government is okay too.", score: -1 },
      { text: "Republicans, but a divided government is okay too.", score: 1 },
      { text: "Republicans — and with a large majority.", score: 2 },
    ],
  },
  {
    text: "Which news sources do you tend to trust more?",
    answers: [
      { text: "Outlets like MSNBC, CNN, or The New York Times.", score: -2 },
      { text: "Mostly mainstream outlets like NPR, ABC, or NBC.", score: -1 },
      { text: "Outlets like The Wall Street Journal or talk radio.", score: 1 },
      { text: "Outlets like Fox News, Newsmax, or The Daily Wire.", score: 2 },
    ],
  },
  {
    text: "If you had to join one party's local volunteer group, which would it be?",
    answers: [
      { text: "The Democrats — happily.", score: -2 },
      { text: "The Democrats, reluctantly.", score: -1 },
      { text: "The Republicans, reluctantly.", score: 1 },
      { text: "The Republicans — happily.", score: 2 },
    ],
  },
  {
    text: "Which party do you trust more to handle health care?",
    answers: [
      { text: "The Democratic Party, strongly.", score: -2 },
      { text: "The Democratic Party, somewhat.", score: -1 },
      { text: "The Republican Party, somewhat.", score: 1 },
      { text: "The Republican Party, strongly.", score: 2 },
    ],
  },
  {
    text: "Which party do you trust more on immigration and border security?",
    answers: [
      { text: "The Democratic Party, strongly.", score: -2 },
      { text: "The Democratic Party, somewhat.", score: -1 },
      { text: "The Republican Party, somewhat.", score: 1 },
      { text: "The Republican Party, strongly.", score: 2 },
    ],
  },
  {
    text: "How would you feel if the other party won the next presidential election?",
    answers: [
      { text: "Worried if a Republican won.", score: -2 },
      { text: "A little uneasy if a Republican won.", score: -1 },
      { text: "A little uneasy if a Democrat won.", score: 1 },
      { text: "Worried if a Democrat won.", score: 2 },
    ],
  },
  {
    text: "Which party better represents people like you?",
    answers: [
      { text: "Democrats, without question.", score: -2 },
      { text: "Democrats, more or less.", score: -1 },
      { text: "Republicans, more or less.", score: 1 },
      { text: "Republicans, without question.", score: 2 },
    ],
  },
  {
    text: "Which party's primary would you vote in if you could only pick one?",
    answers: [
      { text: "Democratic primary, definitely.", score: -2 },
      { text: "Democratic primary, probably.", score: -1 },
      { text: "Republican primary, probably.", score: 1 },
      { text: "Republican primary, definitely.", score: 2 },
    ],
  },
];
