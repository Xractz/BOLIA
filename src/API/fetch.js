class Fetch {
  async get(url) {
    try {
      const response = await fetch(url);
      return response.json();
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  }

  async post(url, data) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  }
}

module.exports = new Fetch();