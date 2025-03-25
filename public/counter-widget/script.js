/**
 * Widget View Counter Script
 */

document.addEventListener('DOMContentLoaded', function() {
  // Lấy thông tin từ URL
  const params = new URLSearchParams(window.location.search);
  const theme = params.get('theme') || 'light';
  const style = params.get('style') || '';
  const character = params.get('character') || '';

  // Lấy siteId và baseUrl từ data attribute hoặc window object
  let siteId = null;
  let baseUrl = null;
  
  // Thử lấy từ data attribute trước
  const widgetElement = document.querySelector('.view-counter-widget');
  if (widgetElement && widgetElement.dataset.siteId) {
    siteId = widgetElement.dataset.siteId;
  }
  
  // Nếu không có trong data attribute, thử lấy từ window object
  if (!siteId && window.counterSiteId) {
    siteId = window.counterSiteId;
  }
  
  // Lấy baseUrl từ window object
  if (window.counterBaseUrl) {
    baseUrl = window.counterBaseUrl;
  }
  
  // Tạo element hiển thị counter
  const counterElement = document.getElementById('counter');
  
  // Thiết lập style cho widget
  setupWidgetStyle(widgetElement, theme, style, character);
  
  // Validate siteId và baseUrl
  if (!siteId || typeof siteId !== 'string' || siteId.trim() === '') {
    counterElement.textContent = 'Lỗi: Thiếu site ID';
    counterElement.style.color = 'red';
    console.error('Site ID không hợp lệ. Vui lòng kiểm tra lại cấu hình.');
    return;
  }

  if (!baseUrl) {
    counterElement.textContent = 'Lỗi: Thiếu base URL';
    counterElement.style.color = 'red';
    console.error('Base URL không hợp lệ. Vui lòng kiểm tra lại cấu hình.');
    return;
  }

  // Log ra thông tin để debug
  console.log('Site ID:', siteId);
  console.log('Base URL:', baseUrl);
  
  // Tải dữ liệu counter
  getCounter(siteId, baseUrl);
  
  /**
   * Thiết lập style cho widget dựa trên tham số
   * @param {HTMLElement} element - Phần tử widget
   * @param {string} theme - Chủ đề (light, dark, anime)
   * @param {string} style - Kiểu dáng (flat, rounded)
   * @param {string} character - Loại nhân vật anime (kawaii, neko, usagi)
   */
  function setupWidgetStyle(element, theme, style, character) {
    // Áp dụng theme
    if (theme) {
      element.classList.add(`theme-${theme}`);
    }
    
    // Áp dụng style
    if (style) {
      element.classList.add(`style-${style}`);
    }
    
    // Xử lý theme anime
    if (theme === 'anime') {
      // Thêm class anime
      element.classList.add('anime');
      
      // Xóa icon mặc định
      const iconElement = element.querySelector('.view-counter-widget__icon');
      if (iconElement) {
        iconElement.innerHTML = '';
        
        // Tạo element nhân vật anime
        const animeCharacter = document.createElement('div');
        animeCharacter.className = 'anime-character';
        
        // Thêm loại nhân vật cụ thể nếu có
        if (character && ['kawaii', 'neko', 'usagi'].includes(character)) {
          animeCharacter.classList.add(character);
        } else {
          // Nếu không chỉ định hoặc không hợp lệ, chọn ngẫu nhiên
          const characters = ['kawaii', 'neko', 'usagi'];
          const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
          animeCharacter.classList.add(randomCharacter);
        }
        
        iconElement.appendChild(animeCharacter);
      }
    }
  }
  
  /**
   * Lấy dữ liệu counter từ API
   * @param {string} siteId - ID của website
   * @param {string} baseUrl - URL cơ sở của API
   */
  function getCounter(siteId, baseUrl) {
    try {
      const apiURL = `${baseUrl}/api/counter/${encodeURIComponent(siteId)}`;
      
      console.log(`Fetching counter data from: ${apiURL}`);
      
      // Hiển thị trạng thái loading
      counterElement.textContent = 'Đang tải...';
      
      fetch(apiURL)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('API response:', data);
          
          if (data && data.success && data.data) {
            // Lưu giá trị cũ để kiểm tra thay đổi
            const oldValue = parseInt(counterElement.textContent || '0', 10);
            const newValue = data.data.views;
            
            // Hiển thị số lượng view
            counterElement.textContent = formatNumber(newValue);
            
            // Thêm animation nếu có sự thay đổi
            if (oldValue !== newValue) {
              counterElement.classList.add('change');
              setTimeout(() => {
                counterElement.classList.remove('change');
              }, 300);
            }
          } else {
            throw new Error('Cấu trúc dữ liệu API không như mong đợi');
          }
        })
        .catch(error => {
          console.error('Error fetching counter:', error);
          counterElement.textContent = 'Lỗi kết nối';
          counterElement.style.color = 'red';
          
          // Thử kết nối lại sau 5 giây
          setTimeout(() => {
            getCounter(siteId, baseUrl);
          }, 5000);
        });
    } catch (error) {
      console.error('Error in getCounter:', error);
      counterElement.textContent = 'Lỗi hệ thống';
      counterElement.style.color = 'red';
    }
  }
  
  /**
   * Format số lượng view để hiển thị
   * @param {number} number - Số lượng view
   * @returns {string} - Chuỗi đã được format
   */
  function formatNumber(number) {
    return number.toString();
  }
}); 