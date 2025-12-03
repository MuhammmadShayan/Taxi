/*==== result-chart =====*/
// Safe Chart.js initialization with element existence checks
(function() {
    'use strict';
    
    function initializeBarChart() {
        var ctx = document.getElementById('bar-chart');
        
        // Check if element exists and Chart.js is available
        if (!ctx || typeof Chart === 'undefined') {
            console.log('Bar chart element not found or Chart.js not available - skipping initialization');
            return;
        }
        
        try {
            Chart.defaults.global.defaultFontFamily = 'Arial';
            Chart.defaults.global.defaultFontSize = 14;
            Chart.defaults.global.defaultFontStyle = '500';
            Chart.defaults.global.defaultFontColor = '#808996';
            
            var chart = new Chart(ctx, {
                // The type of chart we want to create
                type: 'bar',

                // The data for our dataset
                data: {
                    labels: ['Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
                    datasets: [{
                        label: "One",
                        data: [40, 35, 54, 40, 45, 60, 70, 65, 70, 90],
                        backgroundColor: '#287dfa',
                        hoverBackgroundColor: '#2273e5',
                        pointBackgroundColor: '#fff',
                        borderWidth: 0,
                        pointRadius: 4
                    }]
                },

                // Configuration options go here
                options: {
                    tooltips: {
                        /*xPadding: 12,
                        yPadding: 12,*/
                        backgroundColor: '#1c2540'
                    },
                    legend: {
                        display: false
                    },
                    scales: {
                        xAxes: [{
                            barPercentage: 0.4,
                            barThickness: 15,
                            display: true,
                            gridLines: {
                                offsetGridLines: false,
                                display: false
                            }
                        }],
                        yAxes: [{
                            display: true,
                            gridLines: {
                                color: '#eee',
                            },
                            ticks: {
                                fontSize: 14,
                                /*beginAtZero: true,
                                stepSize: 25,
                                suggestedMin: 50,
                                suggestedMax: 100*/
                            }
                        }]

                    }
                }
            });
            
            console.log('✅ Bar chart initialized successfully');
        } catch (error) {
            console.warn('❌ Bar chart initialization error:', error);
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initializeBarChart, 500);
        });
    } else {
        setTimeout(initializeBarChart, 500);
    }
    
})();
