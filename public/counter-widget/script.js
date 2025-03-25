/**
 * Widget View Counter Script
 */

document.addEventListener('DOMContentLoaded', function() {
  // Lấy thông tin từ URL
  const params = new URLSearchParams(window.location.search);
  const theme = params.get('theme') || 'light';
  const style = params.get('style') || '';
  const character = params.get('character') || '';

  // Lấy siteId từ window object hoặc từ data attribute
  const siteId = window.counterSiteId;
  
  // Tạo elemnt hiển thị counter
  const counterElement = document.getElementById('counter');
  const widgetElement = document.querySelector('.view-counter-widget');
  
  // Thiết lập style cho widget
  setupWidgetStyle(widgetElement, theme, style, character);
  
  // Hiển thị thông báo nếu không có siteId
  if (!siteId) {
    counterElement.textContent = 'Lỗi: Thiếu site ID';
    counterElement.style.color = 'red';
    return;
  }
  
  // Tải dữ liệu counter
  getCounter(siteId);
  
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
   */
  function getCounter(siteId) {
    // Xác định URL API dựa trên origin của trang
    const apiURL = `${window.location.origin}/api/counter/${siteId}`;
    
    console.log(`Fetching counter data from: ${apiURL}`);
    
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
        counterElement.textContent = 'Lỗi';
      });
  }
  
  /**
   * Format số lượng view để hiển thị
   * @param {number} number - Số lượng view
   * @returns {string} - Chuỗi đã được format
   */
  function formatNumber(number) {
    // Hiển thị chính xác số lượng view, không chuyển đổi sang định dạng "K"
    return number.toString();
  }
}); 