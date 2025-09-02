let loanChart;

function simulate() {
  const loanAmount = +document.getElementById("loanAmount").value;
  const annualRate = +document.getElementById("interestRate").value / 100;
  const tenureMonths = +document.getElementById("loanTenure").value;
  const lumpSum = +document.getElementById("lumpSum").value;
  const lumpMonths = +document.getElementById("lumpMonths").value;

  const monthlyRate = annualRate / 12;
  const emi = loanAmount * monthlyRate * Math.pow(1+monthlyRate, tenureMonths) /
              (Math.pow(1+monthlyRate, tenureMonths) - 1);

  // Current Loan totals
  let curBalance = loanAmount, curInterest = 0;
  for (let m=1; m<=tenureMonths; m++) {
    let interest = curBalance * monthlyRate;
    let principal = emi - interest;
    curBalance -= principal;
    curInterest += interest;
  }

  // Prepayment scenario
  let newBalance = loanAmount, newInterest = 0, month=0;
  let repaymentRows = "";
  while (newBalance > 0 && month < tenureMonths+100) {
    month++;
    let interest = newBalance * monthlyRate;
    let principal = emi - interest;
    let extra = (month <= lumpMonths ? lumpSum : 0);
    newBalance -= (principal + extra);
    if (newBalance < 0) newBalance = 0;
    newInterest += interest;
    repaymentRows += `<tr>
      <td>${month}</td>
      <td>${(newBalance+principal+extra).toFixed(2)}</td>
      <td>${emi.toFixed(2)}</td>
      <td>${principal.toFixed(2)}</td>
      <td>${interest.toFixed(2)}</td>
      <td>${extra.toFixed(2)}</td>
      <td>${newBalance.toFixed(2)}</td>
    </tr>`;
    if (newBalance <= 0) break;
  }

  // Populate results
  document.getElementById("curTerm").innerText = (tenureMonths/12).toFixed(1) + " yrs";
  document.getElementById("newTerm").innerText = (month/12).toFixed(1) + " yrs";
  document.getElementById("curInterest").innerText = "₹" + curInterest.toFixed(0);
  document.getElementById("newInterest").innerText = "₹" + newInterest.toFixed(0);
  document.getElementById("curPayoff").innerText = "After " + tenureMonths + " months";
  document.getElementById("newPayoff").innerText = "After " + month + " months";

  document.getElementById("timeSaved").innerText = (tenureMonths - month) + " months";
  document.getElementById("interestSaved").innerText = "₹" + (curInterest - newInterest).toFixed(0);
  document.getElementById("netBenefit").innerText = "₹" + (curInterest - newInterest - lumpSum*lumpMonths).toFixed(0);

  document.getElementById("repaymentBody").innerHTML = repaymentRows;

  document.getElementById("results").classList.remove("hidden");
}

// Export CSV
function exportCSV() {
  let table = document.getElementById("repaymentTable");
  let rows = Array.from(table.querySelectorAll("tr"));
  let csv = rows.map(row => 
    Array.from(row.querySelectorAll("th,td"))
         .map(cell => cell.innerText).join(",")
  ).join("\n");

  let blob = new Blob([csv], { type: "text/csv" });
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "repayment_schedule.csv";
  link.click();
}

// Theme Toggle
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
