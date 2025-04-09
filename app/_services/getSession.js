
export const getSession = async (token) => {
    if (!token) {
      return null; // Không có token -> người dùng chưa đăng nhập
    }
  
    try {
      const response = await fetch("http://localhost:8080/users/myInfo", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const userData = await response.json(); // Thông tin người dùng trả về
      return {
        firstName: userData.result.firstName || "Unknown",
        roles: userData.result.roles[0] || "guest", // Vai trò của người dùng
      };
    } catch (error) {
      console.error("Error fetching session:", error);
      return null; // Trả về null nếu xảy ra lỗi
    }
  };
  