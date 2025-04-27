// election-forecast-enhanced.js - Improved reusable functions for election forecast tables

/**
 * Configuration object for easy customization
 */
const ElectionForecast = {
    // Default configuration
    config: {
      maxTableWidth: 1200,             // Maximum width of tables in pixels
      districtColumnWidth: 18,         // District column width in percentage
      outcomeColumnWidth: 15,          // Outcome column width in percentage
      forecastColumnWidth: 67,         // Forecast column width in percentage
      minBarContainerWidth: 200,       // Minimum width for bar containers in pixels
      showPartyCodes: true,            // Whether to show party codes
      decimalsInPercentages: 1,        // Number of decimals in percentage display
      mobileBreakpoint: 768,           // Mobile breakpoint in pixels
      cssPrefix: 'ef',                 // CSS class prefix to avoid conflicts
    },
  
    // Party information
    parties: {
      'lpc': { name: 'LPC', color: '#d71920' },
      'cpc': { name: 'CPC', color: '#1a4782' },
      'ndp': { name: 'NDP', color: '#f37021' },
      'bq': { name: 'Bloc', color: '#33b2cc' },
      'gpc': { name: 'Green', color: '#39b54a' },
      'ppc': { name: 'People\'s Party', color: '#8b4513' },
      'other': { name: 'Other', color: '#999999' }
    },
  
    // Function to initialize a forecast table
    init: function(options = {}) {
      // Merge options with default config
      this.config = {...this.config, ...options};
      
      // Add styles to document
      this._addStyles();
      
      return this;
    },
  
    // Function to load and display province data
    loadProvinces: async function({
      csvPath,             // Path to the CSV data file
      containerId,         // ID of the container element
      provinceIds = [],    // Array of province IDs to show (empty for all)
      provinceNames = []   // Array of province names (matching provinceIds)
    }) {
      // Get container element
      const container = document.getElementById(containerId);
      if (!container) {
        console.error(`Container with ID '${containerId}' not found.`);
        return;
      }
      
      // Clear the container
      container.innerHTML = '';
      
      // Add container class
      container.classList.add(`${this.config.cssPrefix}-container`);
      
      try {
        // Fetch district data
        const allDistricts = await this._fetchElectionData(csvPath);
        
        // If no specific provinces are specified, extract all unique provinces
        if (provinceIds.length === 0) {
          const uniqueProvinces = new Set();
          allDistricts.forEach(district => {
            // Assuming the first digit of districtid identifies the province
            const provinceId = district.districtid.toString().charAt(0);
            uniqueProvinces.add(provinceId);
          });
          provinceIds = Array.from(uniqueProvinces).sort();
          
          // Generate generic province names if not provided
          if (provinceNames.length === 0) {
            provinceNames = provinceIds.map(id => `Province ${id}`);
          }
        }
        
        // Process each province
        provinceIds.forEach((provinceId, index) => {
          // Filter for this province's districts
          const provinceDistricts = allDistricts.filter(
            district => district.districtid.toString().startsWith(provinceId)
          );
          
          // Get the province name
          const provinceName = provinceNames[index] || `Province ${provinceId}`;
          
          // Generate table for this province
          if (provinceDistricts.length > 0) {
            this._generateProvinceTable(provinceDistricts, provinceName, container);
          } else {
            const noDataMsg = document.createElement('p');
            noDataMsg.innerHTML = `<p>No district data available for ${provinceName}.</p>`;
            container.appendChild(noDataMsg);
          }
        });
      } catch (error) {
        console.error("Error loading election data:", error);
        container.innerHTML = `<p>Error loading election data: ${error.message}</p>`;
      }
      
      return this;
    },
  
    // PRIVATE METHODS
    
    // Function to fetch and parse CSV data
    _fetchElectionData: async function(csvPath) {
      try {
        const response = await fetch(csvPath);
        const csvText = await response.text();
        return this._parseCSV(csvText);
      } catch (error) {
        console.error("Error fetching or parsing CSV:", error);
        throw error;
      }
    },
  
    // Simple CSV parser
    _parseCSV: function(text) {
      const lines = text.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      return lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const entry = {};
        
        headers.forEach((header, index) => {
          // Convert numeric values to numbers
          if (!isNaN(values[index]) && values[index] !== '') {
            entry[header] = parseFloat(values[index]);
          } else {
            entry[header] = values[index];
          }
        });
        
        return entry;
      });
    },
  
    // Function to get the full party name from the code
    _getPartyFullName: function(partyCode) {
      return this.parties[partyCode]?.name || 'Unknown';
    },
  
    // Function to create a party row with bar visualization
    _createPartyRow: function(partyCode, percentage, stdDev) {
      if (percentage <= 0) return '';
      
      const mainBarWidth = percentage;
      const errorBarWidth = percentage + stdDev;
      const prefix = this.config.cssPrefix;
      
      return `
        <div class="${prefix}-party-row">
          <div class="${prefix}-party-name">${partyCode.toUpperCase()}</div>
          <div class="${prefix}-vote-percentage">${percentage.toFixed(this.config.decimalsInPercentages)}%</div>
          <div class="${prefix}-bar-container">
            <div class="${prefix}-main-bar ${prefix}-${partyCode}" style="width: ${mainBarWidth}%"></div>
            <div class="${prefix}-error-bar ${prefix}-${partyCode}" style="width: ${errorBarWidth}%"></div>
          </div>
          <div class="${prefix}-stddev">±${stdDev.toFixed(this.config.decimalsInPercentages)}</div>
        </div>
      `;
    },
  
    // Function to generate a single province table
    _generateProvinceTable: function(districts, provinceName, container) {
      const prefix = this.config.cssPrefix;
      
      // Create province header
      const provinceHeader = document.createElement('div');
      provinceHeader.className = `${prefix}-province-header`;
      provinceHeader.id = provinceName.toLowerCase().replace(/\s+/g, '-');
      provinceHeader.textContent = provinceName;
      container.appendChild(provinceHeader);
      
      // Create table wrapper for horizontal scrolling if needed
      const tableWrapper = document.createElement('div');
      tableWrapper.className = `${prefix}-table-wrapper`;
      container.appendChild(tableWrapper);
      
      // Create table
      const table = document.createElement('table');
      table.className = `${prefix}-table`;
      
      // Add table header
      table.innerHTML = `
        <thead>
          <tr>
            <th>District</th>
            <th>Likely Outcome</th>
            <th>Forecast</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;
      
      const tableBody = table.querySelector('tbody');
      
      // Process each district
      districts.forEach(district => {
        // Create a new row
        const row = document.createElement('tr');
        
        // District name and ID
        const districtCell = document.createElement('td');
        districtCell.className = `${prefix}-district-cell`;
        districtCell.innerHTML = `
          <div class="${prefix}-district-name">${this._fixEncoding(district.districtname)}</div>
          <div class="${prefix}-district-id">${district.districtid}</div>
        `;
        
        // Likely outcome cell
        const outcomeCell = document.createElement('td');
        outcomeCell.className = `${prefix}-outcome-cell ${prefix}-${district.outcome}`;
        outcomeCell.textContent = this._getPartyFullName(district.outcome);
        
        // Forecast cell with party rows
        const forecastCell = document.createElement('td');
        forecastCell.className = `${prefix}-forecast-cell`;
        
        // Get all parties with percentages and standard deviations
        const parties = [
          { code: 'lpc', percentage: district.lpc || 0, stdDev: district.lpcstd || 0 },
          { code: 'cpc', percentage: district.cpc || 0, stdDev: district.cpcstd || 0 },
          { code: 'ndp', percentage: district.ndp || 0, stdDev: district.ndpstd || 0 },
          { code: 'bq', percentage: district.bq || 0, stdDev: district.bqstd || 0 },
          { code: 'gpc', percentage: district.gpc || 0, stdDev: district.gpcstd || 0 },
          { code: 'ppc', percentage: district.ppc || 0, stdDev: district.ppcstd || 0 }
        ];
        
        // Filter to only include parties with > 0% and sort by percentage
        const validParties = parties
          .filter(party => party.percentage > 0)
          .sort((a, b) => b.percentage - a.percentage);
        
        // Create a row for each party
        validParties.forEach(party => {
          forecastCell.innerHTML += this._createPartyRow(party.code, party.percentage, party.stdDev);
        });
        
        // Add cells to the row
        row.appendChild(districtCell);
        row.appendChild(outcomeCell);
        row.appendChild(forecastCell);
        
        // Add row to the table
        tableBody.appendChild(row);
      });
      
      // Add table to wrapper
      tableWrapper.appendChild(table);
    },
    // Add this helper method
    _fixEncoding: function(text) {
      if (!text) return '';
      
      // Replace common problematic characters
      return text
        .replace(/�/g, 'é')
        .replace(/Ã©/g, 'é')
        .replace(/Ã¨/g, 'è')
        .replace(/Ã¢/g, 'â') 
        .replace(/Ãª/g, 'ê')
        .replace(/Ã®/g, 'î')
        .replace(/Ã´/g, 'ô')
        .replace(/Ã»/g, 'û')
        .replace(/Ã§/g, 'ç');
    },
    // Add the CSS needed for the tables
    _addStyles: function() {
      const prefix = this.config.cssPrefix;
      const styleId = `${prefix}-styles`;
      
      // Check if styles are already added
      if (document.getElementById(styleId)) {
        return;
      }
      
      const styleEl = document.createElement('style');
      styleEl.id = styleId;
      
      // Generate party-specific styles
      let partyStyles = '';
      Object.entries(this.parties).forEach(([code, info]) => {
        partyStyles += `
          .${prefix}-${code} { background-color: ${info.color}; }
        `;
      });
      
      styleEl.textContent = `
        /* Container styles */
        .${prefix}-container {
          width: 100%;
          max-width: ${this.config.maxTableWidth}px;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        
        /* Table wrapper for horizontal scrolling */
        .${prefix}-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }
        
        /* Province header */
        .${prefix}-province-header {
          margin-top: 30px;
          margin-bottom: 10px;
          padding-bottom: 5px;
          border-bottom: 2px solid #333;
          font-size: 1.5em;
          font-weight: bold;
        }
        
        /* Table styles */
        .${prefix}-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          table-layout: fixed;
        }
        
        .${prefix}-table th {
          background-color: #f2f2f2;
          text-align: left;
          padding: 12px 15px;
          border-bottom: 2px solid #ddd;
          font-weight: bold;
        }
        
        .${prefix}-table td {
          padding: 10px 15px;
          border-bottom: 1px solid #ddd;
          vertical-align: top;
        }
        
        /* Column widths */
        .${prefix}-table th:first-child,
        .${prefix}-table td:first-child {
          width: ${this.config.districtColumnWidth}%;
        }
        
        .${prefix}-table th:nth-child(2),
        .${prefix}-table td:nth-child(2) {
          width: ${this.config.outcomeColumnWidth}%;
        }
        
        .${prefix}-table th:nth-child(3),
        .${prefix}-table td:nth-child(3) {
          width: ${this.config.forecastColumnWidth}%;
        }
        
        /* District cell styles */
        .${prefix}-district-name {
          font-weight: bold;
        }
        
        .${prefix}-district-id {
          font-size: 0.8em;
          color: #666;
          margin-top: 5px;
        }
        
        /* Party row styles */
        .${prefix}-party-row {
          margin-bottom: 8px;
          display: flex;
          align-items: center;
        }
        
        .${prefix}-party-name {
          width: 50px;
          font-weight: bold;
        }
        
        .${prefix}-vote-percentage {
          width: 70px;
          text-align: right;
          padding-right: 10px;
        }
        
        .${prefix}-bar-container {
          flex-grow: 1;
          position: relative;
          height: 20px;
          min-width: ${this.config.minBarContainerWidth}px;
        }
        
        .${prefix}-main-bar {
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }
        
        .${prefix}-error-bar {
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0.3;
        }
        
        .${prefix}-stddev {
          width: 40px;
          text-align: right;
          padding-left: 10px;
        }
        
        /* Party-specific colors */
        ${partyStyles}
        
        /* Responsive styles for smaller screens */
        @media screen and (max-width: ${this.config.mobileBreakpoint}px) {
          .${prefix}-table th:first-child,
          .${prefix}-table td:first-child {
            width: 30%;
          }
          
          .${prefix}-table th:nth-child(2),
          .${prefix}-table td:nth-child(2) {
            width: 20%;
          }
          
          .${prefix}-table th:nth-child(3),
          .${prefix}-table td:nth-child(3) {
            width: 50%;
          }
          
          .${prefix}-party-name {
            width: 40px;
          }
          
          .${prefix}-vote-percentage {
            width: 60px;
          }
        }
        
        /* Override Minimal Mistakes theme table styles */
        .${prefix}-table {
          display: table;
          width: 100%;
          margin-bottom: 2em;
          font-size: 0.9em;
          border-collapse: collapse;
          overflow: visible;
        }
        
        .${prefix}-table th, 
        .${prefix}-table td {
          border: 1px solid #f2f2f2;
        }
      `;
      
      document.head.appendChild(styleEl);
    }
  };