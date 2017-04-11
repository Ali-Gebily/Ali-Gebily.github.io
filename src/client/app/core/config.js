/*
 * Copyright (C) 2016-2017 TopCoder Inc., All Rights Reserved.
 */
/**
 * Application configuration.
 *
 * @author TCSCODER, TCSCODER, TCSCODER
 * @version 1.2
 * 
 * Changes in 1.1:
 * Implemented requirements for Dashboard Development challenge:
 * https://www.topcoder.com/challenge-details/30055326
 *
 * Changes in 1.2:
 *   Living Progress - Build - WWF - Data Download and Security Enhancements v1.0:
 *   https://www.topcoder.com/challenge-details/30056081
 */
(function () {
    'use strict';

    var core = angular.module('app.core');

    var config = {
        appErrorPrefix: '[wwfTrafficDetect Error] ',
        appTitle: 'Detect IT: Fish',
        // replace-env {WWFF_REST_API_BASE_URL}
        REST_API_BASE_URL:'http://ec2-54-218-19-28.us-west-2.compute.amazonaws.com:8082',
        PERIOD_YEARS: [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015],
        DASHBOARD_YEAR: 2015,
        SEARCH_DATA_MAX_IMPORTERS_COUNT: 5,
        SEARCH_DATA_MAX_EXPORTERS_COUNT: 5,
        SEARCH_DATA_MAX_COMMODITIES_COUNT: 5,
        DASHBOARD_CASE_STUDY_COUNT: 3,
        CSV_FILE_NAMES: {
            DATA_COMPARISON: 'results.csv',
            ALERT_DETAILS: 'alerts.csv',
            LEADING_EXPORTERS_BY_WEIGHT: 'exporters_by_weight.csv',
            LEADING_EXPORTERS_BY_WEIGHT_AND_PARTNERS: 'exporter_by_weight_<countryname>.csv',
            LEADING_IMPORTERS_BY_WEIGHT: 'importers_by_weight.csv',
            LEADING_IMPORTERS_BY_WEIGHT_AND_PARTNERS: 'importer_by_weight_<countryname>.csv',
            LEADING_IMPORTERS_BY_VALUE: 'importers_by_value.csv',
            LEADING_IMPORTERS_BY_VALUE_AND_COMMODITIES: 'importer_by_value_<countryname>.csv',
            TOP_COMMODITIES_BY_IMPORT_TRADING_VALUE_OVERALL: 'top_ten_commodities_by_import_trading_value.csv',
            TOP_COMMODITIES_BY_IMPORT_TRADING_VALUE_BY_YEAR: 'top_ten_commodities_by_import_trading_value_by_year.csv',
            TOP_COMMODITIES_BY_IMPORT_TRADING_VALUE_SUM: 'top_twenty_wildcaught_commodities_by_import_trading_value.csv'
        },
        DASHBOARD_TITLES: {
            LEADING_EXPORTERS_BY_WEIGHT: 'Leading Exporters of Seafood and their trading partners (by weight, kg) in ',
            LEADING_IMPORTERS_BY_WEIGHT: 'Leading Importers of Seafood and their trading partners (by weight, kg) in ',
            LEADING_IMPORTERS_BY_VALUE: 'Leading Importers of Seafood and their most imported commodities (by value, USD) in ',
            TOP_COMMODITIES_BY_IMPORT_TRADING_VALUE_OVERALL: 'Top 10 Wild-Caught Commodities from 2003-2015 by Import Trade Value per Kilogram',
            TOP_COMMODITIES_BY_IMPORT_TRADING_VALUE_SUM: 'Top 20 Wild-Caught Commodities (Worldwide) by Export Trading Value (USD) in '
        },
        // replace-env {WWFF_CONTENTFUL_SPACE}
        contentfulSpace:'9i1m79rt44ru',
        // replace-env {WWFF_CONTENTFUL_ACCESS_TOKEN}
        contentfulAccessToken:'d6b16c2a8821ab46dd0038fa3809923c7c3cfc52b882ea0fd61363912d19e995',
        COUNTRY_CODE_MAPPING: {
            'Afghanistan' : 'AFG',
            'Angola' : 'AGO',
            'Albania' : 'ALB',
            'United Arab Emirates' : 'ARE',
            'Argentina' : 'ARG',
            'Armenia' : 'ARM',
            'Antarctica' : 'ATA',
            'French Southern and Antarctic Lands' : 'ATF',
            'Australia' : 'AUS',
            'Austria' : 'AUT',
            'Azerbaijan' : 'AZE',
            'Burundi' : 'BDI',
            'Belgium' : 'BEL',
            'Benin' : 'BEN',
            'Burkina Faso' : 'BFA',
            'Bangladesh' : 'BGD',
            'Bulgaria' : 'BGR',
            'The Bahamas' : 'BHS',
            'Bosnia and Herzegovina' : 'BIH',
            'Belarus' : 'BLR',
            'Belize' : 'BLZ',
            'Bolivia' : 'BOL',
            'Brazil' : 'BRA',
            'Brunei' : 'BRN',
            'Bhutan' : 'BTN',
            'Botswana' : 'BWA',
            'Central African Republic' : 'CAF',
            'Canada' : 'CAN',
            'Switzerland' : 'CHE',
            'Chile' : 'CHL',
            'China' : 'CHN',
            'Ivory Coast': 'CIV',
            "Côte d’Ivoire": 'CIV',
            'Cameroon' : 'CMR',
            'Democratic Republic of the Congo' : 'COD',
            'Republic of the Congo' : 'COG',
            'Colombia' : 'COL',
            'Costa Rica' : 'CRI',
            'Cuba' : 'CUB',
            'Northern Cyprus' : '-99',
            'Cyprus' : 'CYP',
            'Republic of Cyprus': 'CYP',
            'Czech Republic': 'CZE',
            'Germany' : 'DEU',
            'Djibouti' : 'DJI',
            'Denmark' : 'DNK',
            'Dominican Republic' : 'DOM',
            'Algeria' : 'DZA',
            'Ecuador' : 'ECU',
            'Egypt' : 'EGY',
            'Eritrea' : 'ERI',
            'Spain' : 'ESP',
            'Estonia' : 'EST',
            'Ethiopia' : 'ETH',
            'Finland' : 'FIN',
            'Fiji' : 'FJI',
            'Falkland Islands' : 'FLK',
            'France' : 'FRA',
            'French Guiana' : 'GUF',
            'Gabon' : 'GAB',
            'United Kingdom' : 'GBR',
            'Georgia' : 'GEO',
            'Ghana' : 'GHA',
            'Guinea' : 'GIN',
            'Gambia' : 'GMB',
            'Guinea Bissau' : 'GNB',
            'Equatorial Guinea' : 'GNQ',
            'Greece' : 'GRC',
            'Greenland' : 'GRL',
            'Guatemala' : 'GTM',
            'Guyana' : 'GUY',
            'Honduras' : 'HND',
            'Croatia' : 'HRV',
            'Haiti' : 'HTI',
            'Hungary' : 'HUN',
            'Indonesia' : 'IDN',
            'India' : 'IND',
            'Ireland' : 'IRL',
            'Iran' : 'IRN',
            'Iraq' : 'IRQ',
            'Iceland' : 'ISL',
            'Israel' : 'ISR',
            'Italy' : 'ITA',
            'Jamaica' : 'JAM',
            'Jordan' : 'JOR',
            'Japan' : 'JPN',
            'Kazakhstan' : 'KAZ',
            'Kenya' : 'KEN',
            'Kyrgyzstan' : 'KGZ',
            'Cambodia' : 'KHM',
            'South Korea' : 'KOR',
            'Rep. of Korea': 'KOR',
            "Dem. People's Rep. of Korea": 'KOR',
            'Kosovo': '-99',
            'Kuwait' : 'KWT',
            'Laos' : 'LAO',
            'Lebanon' : 'LBN',
            'Liberia' : 'LBR',
            'Libya' : 'LBY',
            'Sri Lanka' : 'LKA',
            'Lesotho' : 'LSO',
            'Lithuania' : 'LTU',
            'Luxembourg' : 'LUX',
            'Latvia' : 'LVA',
            'Morocco' : 'MAR',
            'Moldova' : 'MDA',
            'Madagascar' : 'MDG',
            'Mexico' : 'MEX',
            'Macedonia' : 'MKD',
            'Mali' : 'MLI',
            'Myanmar' : 'MMR',
            'Montenegro' : 'MNE',
            'Mongolia' : 'MNG',
            'Mozambique' : 'MOZ',
            'Mauritania' : 'MRT',
            'Malawi' : 'MWI',
            'Malaysia' : 'MYS',
            'Namibia' : 'NAM',
            'New Caledonia' : 'NCL',
            'Niger' : 'NER',
            'Nigeria' : 'NGA',
            'Nicaragua' : 'NIC',
            'Netherlands' : 'NLD',
            'Norway' : 'NOR',
            'Nepal' : 'NPL',
            'New Zealand' : 'NZL',
            'Oman' : 'OMN',
            'Pakistan' : 'PAK',
            'Panama' : 'PAN',
            'Peru' : 'PER',
            'Philippines' : 'PHL',
            'Papua New Guinea' : 'PNG',
            'Poland' : 'POL',
            'Puerto Rico' : 'PRI',
            'North Korea' : 'PRK',
            'Portugal' : 'PRT',
            'Paraguay' : 'PRY',
            'Qatar' : 'QAT',
            'Romania' : 'ROU',
            'Russian Federation' : 'RUS',
            'Rwanda' : 'RWA',
            'Western Sahara' : 'ESH',
            'Saudi Arabia' : 'SAU',
            'Sudan' : 'SDN',
            'South Sudan' : 'SSD',
            'Senegal' : 'SEN',
            'Solomon Islands' : 'SLB',
            'Sierra Leone' : 'SLE',
            'El Salvador' : 'SLV',
            'Somaliland' : '-99',
            'Somalia' : 'SOM',
            'Republic of Serbia' : 'SRB',
            'Suriname': 'SUR',
            'Singapore': 'SGP',
            'Slovakia' : 'SVK',
            'Slovenia' : 'SVN',
            'Sweden' : 'SWE',
            'Swaziland' : 'SWZ',
            'Syria' : 'SYR',
            'Chad' : 'TCD',
            'Togo' : 'TGO',
            'Thailand' : 'THA',
            'Tajikistan' : 'TJK',
            'Turkmenistan' : 'TKM',
            'East Timor' : 'TLS',
            'Trinidad and Tobago' : 'TTO',
            'Tunisia' : 'TUN',
            'Turkey' : 'TUR',
            'Taiwan' : 'TWN',
            'United Republic of Tanzania' : 'TZA',
            'Uganda' : 'UGA',
            'Ukraine' : 'UKR',
            'Uruguay' : 'URY',
            'USA': 'USA',
            'United States of America': 'USA',
            'USA and Puerto Rico': 'USA',
            'USA, Puerto Rico and US Virgin Islands': 'USA',
            'Uzbekistan': 'UZB',
            'Venezuela' : 'VEN',
            'Vietnam' : 'VNM',
            'Viet Nam': 'VNM',
            'Vanuatu': 'VUT',
            'West Bank' : 'PSE',
            'Yemen' : 'YEM',
            'South Africa' : 'ZAF',
            'Zambia' : 'ZMB',
            'Zimbabwe' : 'ZWE'
        },
        SMALL_COUNTRY_MAP_DATA:[{				
                name: 'China, Hong Kong SAR',
                radius: 5,
                latitude: 22.422195, 
                longitude: 114.131946          
            },
            {				
                name: 'China, Hong Kong Special Administrative Region',
                radius: 5,
                latitude: 22.422195, 
                longitude: 114.131946          
            },
            {
                name: 'Seychelles',
                radius: 5,
                latitude: -4.668050, 
                longitude: 55.469368            
            },
            {
                name: 'Singapore',
                radius: 5,
                latitude: 1.361394,
                longitude: 103.831868            
            },
			{
				name: 'Taiwan, Province of China',
                radius: 5,
                latitude: 23.880833,
                longitude: 120.838910    
			},
			{
				name: 'Mauritius',
                radius: 5,
                latitude: -20.176286,
                longitude: 57.692715   
			},
            {
                name: 'France, Monaco',
                radius: 5,
                latitude: 43.733889,
                longitude: 7.419563
            },
            {
                name: 'Bahrain',
                radius: 5,
                latitude: 26.040442,
                longitude: 50.557320
			}
        ],
        CHART_COLORS: [{
                "id": 1,
                "color": "red",
                "hex": "#e41a1c"
            },
            {
                "id": 2,
                "color": "blue",
                "hex": "#377eb8"
            },
            {
                "id": 3,
                "color": "green",
                "hex": "#4daf4a"
            },
            {
                "id": 4,
                "color": "purple",
                "hex": "#984ea3"
            },
            {
                "id": 5,
                "color": "orange",
                "hex": "#ff7f00"
            },
            {
                "id": 6,
                "color": "yellow",
                "hex": "#ffff33"
            },
            {
                "id": 7,
                "color": "brown",
                "hex": "#a65628"
            },
            {
                "id": 8,
                "color": "pink",
                "hex": "#f781bf"
            },
            {
                "id": 9,
                "color": "grey",
                "hex": "#999999"
            }
        ]
    };

    core.constant('config', config);

    core.config(configure);

    configure.$inject = ['$httpProvider','$logProvider', 'contentfulProvider', 'routerHelperProvider', 'exceptionHandlerProvider'];
    /* @ngInject */
    function configure($httpProvider, $logProvider, contentfulProvider, routerHelperProvider, exceptionHandlerProvider) {
       $httpProvider.interceptors.push('httpInterceptor');
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
        exceptionHandlerProvider.configure(config.appErrorPrefix);
        routerHelperProvider.configure({ docTitle: config.appTitle + ' | ' });

        // configure Contentful
        contentfulProvider.setOptions({
            space: '9i1m79rt44ru',
            accessToken: 'd6b16c2a8821ab46dd0038fa3809923c7c3cfc52b882ea0fd61363912d19e995'
        });
    }
})();
