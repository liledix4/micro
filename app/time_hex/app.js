const selector = {
    toYear: document.getElementById('to-year'),
    toMonth: document.getElementById('to-month'),
    fromYear: document.getElementById('from-year'),
    fromMonth: document.getElementById('from-month'),
    size: document.getElementById('size'),
};
const result = document.getElementById('result');
function leadingZeros(num, size = 1) {
    num = num.toString();
    while (num.length < size) num = '0' + num;
    return num;
}
function monthAmount() {
    const value = {
        toYear: parseInt(selector.toYear.value),
        toMonth: parseInt(selector.toMonth.value) - 1,
        fromYear: parseInt(selector.fromYear.value),
        fromMonth: parseInt(selector.fromMonth.value) - 1,
    };
    if (value.fromYear > value.toYear)
        return '"To" year is higher than "From" year. Fix it.';
    else {
        if (value.fromYear === value.toYear && value.fromMonth > value.toMonth)
            return '"To" month is higher than "From" month. Fix it.';
        else {
            return (value.toYear - value.fromYear) * 12 + value.toMonth - value.fromMonth + 1;
        }
    }
}
function shiftedDate(shift) {
    let year = '';
    let month = '';
    const value = {
        fromYear: parseInt(selector.fromYear.value),
        fromMonth: parseInt(selector.fromMonth.value) - 1,
    };
    const firstYearCeiling = 12 - value.fromMonth;

    if (shift < firstYearCeiling) {
        year = value.fromYear;
        month = value.fromMonth + 1 + shift;
    }
    else {
        shift = shift - firstYearCeiling;
        const yearDifference = parseInt(shift / 12);
        const monthDifference = shift - 12 * yearDifference + 1;
        year = value.fromYear + yearDifference + 1;
        month = monthDifference;
    }
    month = leadingZeros(month, 2);
    return `${year}.${month}: `;
}
function doIt() {
    let returnText = '';
    const months = monthAmount();
    if (typeof months === 'number')
        for (let i = 0; i < months; i++) {
            returnText += shiftedDate(i);
            returnText += leadingZeros(i.toString(16).toUpperCase(), parseInt(selector.size.value));
            if (i !== months - 1) returnText += '\n';
        }
    else if (typeof months === 'string')
        returnText = months;
    else console.log(months);
    result.innerText = returnText;
}
Object.keys(selector).forEach(singleSelector => {
    selector[singleSelector].addEventListener('input', doIt);
});
doIt();