document.addEventListener('DOMContentLoaded', async (event) => {
    const score = document.querySelector("#scores");
    const liveBtn = document.querySelector("#liveBtn");
    const resultBtn = document.querySelector("#resultBtn");
    const fixtureBtn = document.querySelector("#fixtureBtn");

    const fetchAndDisplayMatches = async (matchType) => {
        try {
            const response = await fetch('https://api.cricapi.com/v1/cricScore?apikey=771c1728-ac8a-449a-99fb-50006ebca905');
            const data = await response.json();

            if (data && data.data) {
                const matches = data.data.filter(match => match.series === "ICC Mens T20 World Cup 2024" && match.ms === matchType);

                if (matches.length > 0) {
                    const matchesHTML = matches.reverse().map(match => {
                        const dateTimeGMT = new Date(match.dateTimeGMT);
                        const dateTimeIST = new Date(dateTimeGMT.getTime() + 5.5 * 60 * 60 * 1000); // Convert to IST

                        return `
                            <div class="match border-b border-gray-300 pb-4 mb-4">
                                <h2 class="text-lg font-semibold flex items-center mb-2">
                                    <img src="${match.t1img}" alt="${match.t1}" class="w-8 h-8 mr-2"/> ${match.t1} vs 
                                    <img src="${match.t2img}" alt="${match.t2}" class="w-8 h-8 mx-2"/> ${match.t2}
                                </h2>
                                <p class="text-gray-600">Date: ${dateTimeIST.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} ${dateTimeIST.toLocaleTimeString('en-IN')}</p>
                                <p class="text-gray-600">Status: ${match.status}</p>
                            </div>
                        `;
                    }).join('');
                    score.innerHTML = matchesHTML;
                } else {
                    score.innerHTML = `No ${matchType} matches available.`;
                }
            } else {
                score.innerHTML = "No live scores available.";
            }
        } catch (error) {
            score.innerHTML = "Error fetching live scores.";
            console.error('Error:', error);
        }
    };

    liveBtn.addEventListener('click', () => {
        fetchAndDisplayMatches("live");
    });

    resultBtn.addEventListener('click', () => {
        fetchAndDisplayMatches("result");
    });

    fixtureBtn.addEventListener('click', () => {
        fetchAndDisplayMatches("fixture");
    });

    // Initially fetch and display live matches by default
    fetchAndDisplayMatches("live");
});
