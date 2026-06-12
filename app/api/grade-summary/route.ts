import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { finalGrade, actualMultiple, benchmarkMultiple, dscr, priceRating, industry, price, revenue, sde, monthlyLoanPayment } = data;

  const fmt = (n: number) => n ? "$" + Math.round(n).toLocaleString() : "N/A";
  const ind = industry ? industry.charAt(0).toUpperCase() + industry.slice(1) : "This";
  const multipleText = actualMultiple > 0 ? `priced at ${actualMultiple}x SDE (industry avg ${benchmarkMultiple}x)` : "listed";
  const dscrText = dscr >= 1.5 ? "strong cash flow that comfortably covers SBA loan payments" : dscr >= 1.25 ? "adequate cash flow that meets SBA minimum requirements" : dscr > 0 ? "weak cash flow that falls below SBA minimum requirements" : "cash flow that should be verified before proceeding";
  const negotiateText = actualMultiple > benchmarkMultiple * 1.2 ? ` — negotiate the price down toward ${fmt(sde * benchmarkMultiple)} to get fair value` : actualMultiple < benchmarkMultiple * 0.85 ? " — this is below market value and worth moving on quickly" : "";

  let summary = "";

  if (finalGrade >= 8) {
    summary = `This ${ind} business is an excellent buy — ${multipleText} with ${dscrText} and a monthly SBA payment of ${fmt(monthlyLoanPayment)}.`;
  } else if (finalGrade >= 6) {
    summary = `This ${ind} business is a solid opportunity — ${multipleText} with ${dscrText}${negotiateText}.`;
  } else if (finalGrade >= 4) {
    summary = `This ${ind} business needs scrutiny — ${multipleText} with ${dscrText}${negotiateText}.`;
  } else {
    summary = `This ${ind} business is not recommended at this price — ${multipleText} with ${dscrText}${negotiateText}.`;
  }

  return NextResponse.json({ summary });
}
