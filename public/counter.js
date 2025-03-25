/**
 * View Counter Script
 * 
 * Hướng dẫn sử dụng:
 * 1. Nhúng script này vào trang web của bạn:
 *    <script src="https://your-domain.com/counter.js" data-site-id="YOUR_SITE_ID"></script>
 * 
 * 2. Để hiển thị số lượt xem, thêm thẻ HTML với class "view-counter":
 *    <span class="view-counter"></span>
 */

(function() {
  // Lấy script tag hiện tại
  const currentScript = document.currentScript;
  
  // Lấy site ID từ thuộc tính data
  const siteId = currentScript.getAttribute('data-site-id');
  
  // Lấy baseUrl từ src của script
  const baseUrl = currentScript.src.replace(/\/counter\.js$/, '');
  
  console.log(`View Counter initialized for siteId: ${siteId}`);
  console.log(`Base URL: ${baseUrl}`);
  
  // Nếu không có siteId, không làm gì cả
  if (!siteId) {
    console.error('View Counter: Missing data-site-id attribute');
    return;
  }

  // Nếu không có baseUrl, không làm gì cả
  if (!baseUrl) {
    console.error('View Counter: Could not determine base URL');
    return;
  }

  // Hàm kiểm tra xem đã tính view chưa (để tránh đếm nhiều lần)
  function hasViewedPage() {
    try {
      // Lấy danh sách các trang đã xem từ localStorage
      const viewedPages = JSON.parse(localStorage.getItem('view-counter-viewed') || '{}');
      const pageKey = `${siteId}_${window.location.pathname}`;
      
      console.log(`Checking if page has been viewed: ${pageKey}`);
      
      // Kiểm tra xem đã xem trang này trong 24h qua chưa
      if (viewedPages[pageKey]) {
        const lastViewed = new Date(viewedPages[pageKey]);
        const now = new Date();
        const hoursSinceLastView = (now - lastViewed) / (1000 * 60 * 60);
        
        console.log(`Last viewed ${hoursSinceLastView.toFixed(2)} hours ago`);
        
        // Nếu đã xem trong 24h qua, trả về true
        if (hoursSinceLastView < 24) {
          return true;
        }
      }
      
      // Nếu chưa xem hoặc đã quá 24h, cập nhật localStorage
      viewedPages[pageKey] = new Date().toISOString();
      localStorage.setItem('view-counter-viewed', JSON.stringify(viewedPages));
      console.log('Page marked as viewed');
      return false;
    } catch (error) {
      console.error('View Counter:', error);
      return false;
    }
  }

  // Hàm tăng lượt xem
  async function incrementView() {
    try {
      console.log('Starting incrementView process');
      
      // Kiểm tra xem người dùng đã xem trang này chưa
      if (hasViewedPage()) {
        console.log('Page already viewed in the last 24h, not incrementing view');
        // Nếu đã xem, chỉ lấy thông tin counter mà không tăng view
        await getCounter();
        return;
      }

      console.log(`Sending increment request to: ${baseUrl}/api/counter/${siteId}/view`);
      
      // Gửi request để tăng lượt xem
      const response = await fetch(`${baseUrl}/api/counter/${siteId}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error response: ${response.status} - ${errorText}`);
        throw new Error(`Failed to increment view count: ${response.status}`);
      }

      const data = await response.json();
      console.log('View increment successful, data:', data);
      
      // Cập nhật số lượt xem trên trang
      updateCounterElements(data.data.views);
    } catch (error) {
      console.error('View Counter Error:', error);
      // Nếu lỗi xảy ra, vẫn thử lấy thông tin counter
      await getCounter();
    }
  }

  // Hàm lấy thông tin counter
  async function getCounter() {
    try {
      console.log(`Fetching counter data from: ${baseUrl}/api/counter/${siteId}`);
      
      const response = await fetch(`${baseUrl}/api/counter/${siteId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error response: ${response.status} - ${errorText}`);
        throw new Error(`Failed to get view count: ${response.status}`);
      }

      const data = await response.json();
      console.log('Counter data received:', data);
      
      // Cập nhật số lượt xem trên trang
      updateCounterElements(data.data.views);
    } catch (error) {
      console.error('View Counter Error:', error);
      updateCounterElements('?');
    }
  }

  // Hàm cập nhật các element hiển thị counter
  function updateCounterElements(views) {
    // Tìm tất cả các element có class "view-counter"
    const counterElements = document.querySelectorAll('.view-counter');
    
    console.log(`Updating ${counterElements.length} counter elements with views: ${views}`);
    
    // Cập nhật nội dung của các element
    counterElements.forEach(element => {
      element.textContent = formatNumber(views);
    });
  }

  // Hàm format số lượt xem (VD: 1000 -> 1,000)
  function formatNumber(number) {
    if (isNaN(number)) return number;
    return new Intl.NumberFormat().format(number);
  }

  // Chạy khi trang đã load
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('Document already ready, incrementing view');
    incrementView();
  } else {
    console.log('Waiting for DOMContentLoaded event');
    window.addEventListener('DOMContentLoaded', incrementView);
  }
})(); 