const $ = (id) => document.getElementById(id);
const moneyNumber = (id) => Number($(id)?.value || 0);
const checkedNumber = (name) => Number(document.querySelector(`input[name="${name}"]:checked`)?.value || 0);
const checkedIndex = (name) => [...document.querySelectorAll(`input[name="${name}"]`)].findIndex((el) => el.checked) + 1;
const format = (value, digits = 0) => Number(value).toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits });

function overallGrade(total) {
  if (total < 3666) return ['A+', 'Seriously? This is very impressive!'];
  if (total < 7333) return ['A', 'Excellent. Keep it up.'];
  if (total < 10999) return ['A-', 'Good job. Don\'t stop now.'];
  if (total < 14666) return ['B+', 'Just a little extra effort from an A.'];
  if (total < 18333) return ['B', 'Not bad. You\'re almost there.'];
  if (total < 21999) return ['B-', 'Pretty good, and just above average.'];
  if (total < 25666) return ['C+', 'Still average. Not bad, but there is room to improve.'];
  if (total < 29333) return ['C', 'Average. You can definitely do better than average.'];
  if (total < 32999) return ['C-', 'Close to a D, but still fixable.'];
  if (total < 36666) return ['D+', 'Not your best effort yet.'];
  if (total < 40333) return ['D', 'Below average, with clear places to improve.'];
  if (total < 43999) return ['D-', 'Not an F, but still a heavy footprint.'];
  return ['F', 'This footprint is high, but the biggest categories show where to start.'];
}

function simpleGrade(value, bands, higherIsBetter = false) {
  if (Number.isNaN(value)) return 'N/A';
  if (higherIsBetter) {
    if (value >= bands[0]) return 'A';
    if (value >= bands[1]) return 'B';
    if (value >= bands[2]) return 'C';
    if (value >= bands[3]) return 'D';
    if (value > 0) return 'F';
    return 'N/A';
  }
  if (value < bands[0]) return 'A';
  if (value < bands[1]) return 'B';
  if (value < bands[2]) return 'C';
  if (value < bands[3]) return 'D';
  return 'F';
}

function calculate() {
  const people = Math.max(1, moneyNumber('number_of_people'));
  const electricPrice = Math.max(0.01, moneyNumber('electric_price'));
  const gasPrice = Math.max(0.01, moneyNumber('gas_price'));
  const oilPrice = Math.max(0.01, moneyNumber('fuel_oil_price'));
  const electric = ((moneyNumber('electric_bill') / people) / electricPrice) * 1.37 * 12;
  const gas = ((moneyNumber('gas_bill') / people) / gasPrice) * 120.61 * 12;
  const fuelOil = ((moneyNumber('fuel_oil_bill') / people) / oilPrice) * 22.28 * 12;
  const totalWaste = checkedNumber('waste');
  const recyclingLevel = checkedIndex('recycle');
  const recyclingReduction = 0.4181 * ((6 - recyclingLevel) / 4);
  const wasteAfterRecycling = Math.max(0, totalWaste - totalWaste * recyclingReduction);
  const home = electric + gas + fuelOil + wasteAfterRecycling;

  const milesDriven = moneyNumber('miles_driven');
  const mpg = Math.max(1, moneyNumber('fuel_economy'));
  const vehicle = (milesDriven / mpg) * (19.4 * (100 / 95));
  const air = moneyNumber('miles_flown') * 0.4395;
  const meat = checkedNumber('meat');
  const total = home + vehicle + air + meat;
  const tons = total * 0.0005;
  const [grade, message] = overallGrade(total);

  const gradeElectric = simpleGrade(electric, [6500/people, 13000/people, 19500/people, 26000/people]);
  const gradeGas = simpleGrade(gas, [4500/people, 9000/people, 13500/people, 18000/people]);
  const gradeFuelOil = simpleGrade(fuelOil, [6000/people, 12000/people, 18000/people, 24000/people]);
  const gradeWaste = totalWaste <= 253 ? 'A' : totalWaste === 505 ? 'B' : totalWaste === 1010 ? 'C' : totalWaste === 2020 ? 'D' : 'F';
  const gradeRecycling = ['N/A', 'A', 'B', 'C', 'D', 'F'][recyclingLevel] || 'N/A';
  const gradeMiles = simpleGrade(milesDriven, [4500, 9000, 13500, 18000]);
  const gradeMpg = simpleGrade(mpg, [36, 27, 18, 9], true);
  const gradeDriving = simpleGrade(vehicle, [4500, 9000, 13500, 18000]);
  const gradeFlying = simpleGrade(air, [175, 350, 525, 700]);
  const gradeEating = meat <= 819 ? 'A' : meat === 1637 ? 'B' : meat === 3274 ? 'C' : meat === 6548 ? 'D' : 'F';

  $('total-pounds').textContent = format(total);
  $('total-tons').textContent = format(tons, 2);
  $('overall-grade').textContent = grade;
  $('grade-message').textContent = message;

  const rows = [
    ['Electricity', electric, gradeElectric],
    ['Natural gas', gas, gradeGas],
    ['Fuel oil', fuelOil, gradeFuelOil],
    ['Waste before recycling', totalWaste, gradeWaste],
    ['Waste after recycling', wasteAfterRecycling, gradeRecycling],
    ['Driving miles', milesDriven, gradeMiles],
    ['Vehicle emissions', vehicle, gradeDriving],
    ['Fuel economy', mpg, gradeMpg, 'MPG'],
    ['Flying', air, gradeFlying],
    ['Eating habits', meat, gradeEating]
  ];

  $('breakdown').innerHTML = rows.map(([name, value, g, unit]) => `
    <div class="breakdown-row">
      <span>${name}</span>
      <strong>${format(value)} ${unit || 'lb'}</strong>
      <span class="mini-grade">${g}</span>
    </div>
  `).join('');

  $('results').classList.remove('hidden');
  $('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.getElementById('footprint-form').addEventListener('submit', (event) => {
  event.preventDefault();
  calculate();
});

document.getElementById('reset-button').addEventListener('click', () => {
  document.getElementById('footprint-form').reset();
  $('results').classList.add('hidden');
});
