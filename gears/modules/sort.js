export function sortByMultipleCriterias(a, b, listOfCriterias) {
    let sortBy, aFixed, bFixed;

    listOfCriterias.some(criteria => {
        let aCrit = a[criteria];
        let bCrit = b[criteria];
        if (typeof aCrit === 'string') {
            aCrit = aCrit.toString().toUpperCase();
            bCrit = bCrit.toString().toUpperCase();
        }
        if (aCrit !== bCrit) {
            sortBy = criteria;
            return true;
        }
    });

    // Fixing case for the final sorting
    if (typeof a[sortBy] === 'string') {
        aFixed = a[sortBy].toUpperCase();
        bFixed = b[sortBy].toString().toUpperCase();
    }
    else {
        aFixed = a[sortBy];
        bFixed = b[sortBy];
    }

    if (sortBy === undefined)
        return 0;
    else if (aFixed < bFixed)
        return -1;
    else if (aFixed > bFixed)
        return 1;
}