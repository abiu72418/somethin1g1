async function fetchData(cik) {
    const response = await fetch(`https://data.sec.gov/api/xbrl/companyconcept/CIK${cik}/dei/EntityCommonStockSharesOutstanding.json`, {
        headers: { 'User-Agent': 'YourAppName/1.0' }
    });
    const data = await response.json();
    const entityName = data.entityName;
    const shares = data.units.shares.filter(entry => entry.fy > '2020' && !isNaN(entry.val));

    const max = shares.reduce((prev, current) => (prev.val > current.val) ? prev : current);
    const min = shares.reduce((prev, current) => (prev.val < current.val) ? prev : current);

    const result = {
        entityName: entityName,
        max: { val: max.val, fy: max.fy },
        min: { val: min.val, fy: min.fy }
    };

    return result;
}

async function updatePage(cik) {
    const data = await fetchData(cik);
    document.title = data.entityName;
    document.getElementById('share-entity-name').innerText = data.entityName;
    document.getElementById('share-max-value').innerText = data.max.val;
    document.getElementById('share-max-fy').innerText = data.max.fy;
    document.getElementById('share-min-value').innerText = data.min.val;
    document.getElementById('share-min-fy').innerText = data.min.fy;
}

const urlParams = new URLSearchParams(window.location.search);
const cik = urlParams.get('CIK') || '0000004904';
updatePage(cik);
