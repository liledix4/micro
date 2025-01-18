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
function shiftedDate() {
    return 'TBA date: ';
}
function doIt() {
    let returnText = '';
    const months = monthAmount();
    if (typeof months === 'number')
        for (let i = 0; i < months; i++) {
            returnText += shiftedDate();
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