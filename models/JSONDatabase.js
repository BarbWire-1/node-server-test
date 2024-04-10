const fs = require('fs').promises;
const path = require('path');
const { v4 } = require("uuid");
const { writeDataToFile } = require("../utils.js");

class JSONDatabase {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = [];
  }

 async initialize() {
    try {
      const absolutePath = path.resolve(__dirname, this.filePath);
      const jsonData = await fs.readFile(absolutePath, 'utf8');
      this.data = JSON.parse(jsonData);
    } catch (error) {
      console.error("Error initializing JSON database:", error);
    }
  }

  async findAll() {
    return this.data;
  }

  async findById(id) {
    return this.data.find((item) => item.id === id);
  }

  async create(item) {
    const newItem = { id: v4(), ...item };
    this.data.push(newItem);
    await this.#saveToFile();
    return newItem;
  }

  async update(id, newData) {
    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Item with id ${id} not found.`);
    }
    this.data[index] = { id, ...newData };
    await this.#saveToFile();
    return this.data[index];
  }

  async remove(id) {
    this.data = this.data.filter((item) => item.id !== id);
    await this.#saveToFile();
  }

  async findByQuery(queryParams) {
    return this.data.filter((item) => {
      for (const key in queryParams) {
        if (item[key].toString() !== queryParams[key]) {
          return false;
        }
      }
      return true;
    });
  }

  async #saveToFile() {
    await writeDataToFile(this.filePath, this.data);
  }
}

module.exports = JSONDatabase;
