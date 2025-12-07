// Safe dashboard initialization with proper jQuery and sparkline checks
(function($) {
    'use strict';
    
    // Wait for jQuery and sparkline to be available
    function initializeDashboard() {
        if (typeof $ === 'undefined' || typeof $.fn.sparkline === 'undefined') {
            console.warn('jQuery or sparkline not available, skipping dashboard initialization');
            return;
        }
        
        // Initialize sparkline charts only if elements exist
        try {
            if ($(".visits-chart").length) {
                $(".visits-chart").sparkline( [0,0,1000,1250,3000,2500,2100,2500,2450,4000,2200,2300,2000,2100,1700,2020,2050,1800,1850,1100,1400,1750,1500], {
                    type: 'line',
                    width: '90px',
                    height: '25px',
                    lineColor: '#287dfa',
                    fillColor: '#ebf5f9',
                    spotColor: '#2273e5',
                    minSpotColor: '#2273e5',
                    maxSpotColor: '#2273e5',
                    highlightSpotColor: '#808996',
                    highlightLineColor: '#808996',
                    spotRadius: 0,
                    chartRangeMin: 5,
                    chartRangeMax: 10,
                    chartRangeMinX: 5,
                    chartRangeMaxX: 5,
                    normalRangeMin: 5,
                    normalRangeMax: 5,
                    normalRangeColor: '#ebf5f9',
                    drawNormalOnTop: true
                });
            }

            if ($(".previews-chart").length) {
                $(".previews-chart").sparkline([1,21,17,20,50,18,16,1,5,20,14,12,11,25,7,3,35,23,16,12,7,16,25], {
                    type: 'line',
                    width: '90px',
                    height: '25px',
                    lineColor: '#287dfa',
                    fillColor: '#ebf5f9',
                    spotColor: '#2273e5',
                    minSpotColor: '#2273e5',
                    maxSpotColor: '#2273e5',
                    highlightSpotColor: '#808996',
                    highlightLineColor: '#808996',
                    spotRadius: 0,
                    chartRangeMin: 5,
                    chartRangeMax: 10,
                    chartRangeMinX: 5,
                    chartRangeMaxX: 5,
                    normalRangeMin: 5,
                    normalRangeMax: 5,
                    normalRangeColor: '#ebf5f9',
                    drawNormalOnTop: true
                });
            }

            if ($(".visits-chart-2").length) {
                $(".visits-chart-2").sparkline([1,3,5,10,8,9,10,8,7,8,9,7,8,7,9,8,7,8,7,8,9,10,8,9,8,10,6], {
                    type: 'line',
                    width: '90px',
                    height: '15px',
                    lineColor: '#287dfa',
                    fillColor: '#ebf5f9',
                    spotColor: '#2273e5',
                    minSpotColor: '#2273e5',
                    maxSpotColor: '#2273e5',
                    highlightSpotColor: '#808996',
                    highlightLineColor: '#808996',
                    spotRadius: 0,
                    chartRangeMin: 5,
                    chartRangeMax: 10,
                    chartRangeMinX: 5,
                    chartRangeMaxX: 5,
                    normalRangeMin: 5,
                    normalRangeMax: 5,
                    normalRangeColor: '#ebf5f9',
                    drawNormalOnTop: true
                });
            }
            
            // console.log('✅ Dashboard sparkline charts initialized successfully');
        } catch (error) {
            console.warn('❌ Dashboard initialization error:', error);
        }
    }
    
    // Initialize when document is ready
    $(document).ready(function() {
        // Small delay to ensure all scripts are loaded
        setTimeout(initializeDashboard, 500);
    });
    
})(typeof jQuery !== 'undefined' ? jQuery : window.$ || {});

