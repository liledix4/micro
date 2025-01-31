import { copyToClipboard } from "../../gears/modules/js_clipboard/clipboard.js";


const config = {
    afterCommaLength: 1,
    spaces: {
        firstWeek: ' ',
        afterComma: ' ',
    },
};


function doIt() {
    const firstDay = getWeekDay1();

    const selectorSpaceSize = document.getElementById('spacesize');
    const selectorInput = document.getElementById('input');
    const code = document.getElementById('code');

    const afterCommaLength = config.afterCommaLength;
    const spacesAfterComma = config.spaces.afterComma.repeat(afterCommaLength);

    if (firstDay && selectorSpaceSize.value && selectorInput.value) {
        const spaceSize = parseInt(selectorSpaceSize.value);
        const firstEmptyCells = firstDay - 1;
        const input = selectorInput.value;

        const tab = ' '.repeat(spaceSize);
        const inputNumbers = input.split(/,\s*/).map((s) => {return parseInt(s);});
        const latestDay = inputNumbers[inputNumbers.length - 1];
        const latestDayDigits = `${latestDay}`.length;

        let mondays = [];

        if (firstDay === 1) mondays.push(firstDay);

        for (let i = 7 + 2 - firstDay; i <= latestDay; i += 7)
            mondays.push(i);

        let returnHTML = '';
        let weeks = [
            config.spaces.firstWeek.repeat((latestDayDigits + config.spaces.afterComma.length + afterCommaLength) * firstEmptyCells)
        ];
        let weekNumber = 0;
        let dayStrings = [];

        for (let i = 1; i <= latestDay; i++) {
            const numberExists = inputNumbers.filter(item => item === i).length === 1;
            const isMonday = mondays.filter(item => item === i).length === 1;
            const isSunday = mondays.filter(item => item === i + 1).length === 1;

            if (numberExists) {
                let yeah = '';

                if (i < 10) yeah += ' ';
                yeah += `${i}`;
                if (i !== latestDay) yeah += ',';

                dayStrings.push(yeah);
            }
            else dayStrings.push('   ');

            if (isMonday && i !== 1) {
                weekNumber++;
                weeks[weekNumber] = '';
            }

            weeks[weekNumber] += dayStrings[i - 1];
            if (!isSunday && i !== latestDay)
                weeks[weekNumber] += spacesAfterComma;
        }

        weeks.forEach(week => {
            if (!week.match(/^\s*$/)) {
                const noTrailingSpaces = week.match(/(.*?)\s*$/)[1];
                returnHTML += tab + noTrailingSpaces + '\n';
            }
        });

        code.innerHTML = returnHTML;
    }
}


function getWeekDay1() {
    const selectorYear = document.getElementById('year');
    const selectorMonth = document.getElementById('month');

    if (selectorYear.value && selectorMonth.value) {
        const year = parseInt(selectorYear.value);
        const month = parseInt(selectorMonth.value);
        const date = new Date(year, month);
        let weekDay1 = date.getDay();
        if (weekDay1 === 0) weekDay1 = 7;
        return weekDay1;
    }
}


function copyText() {
    const codeSelector = document.getElementById('code');
    const copySelector = document.getElementById('copy');
    const text = codeSelector.innerHTML;

    copySelector.style.animation = 'none';
    setTimeout(() => {
        copySelector.style.animation = 'hit-the-button 2s 1';
    }, 1);

    copyToClipboard(text);
}


document.getElementById('spacesize').addEventListener('input', doIt);
document.getElementById('input').addEventListener('input', doIt);
document.getElementById('year').addEventListener('input', doIt);
document.getElementById('month').addEventListener('change', doIt);
document.getElementById('copy').addEventListener('click', copyText);