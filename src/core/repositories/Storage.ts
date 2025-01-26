import { Organization } from "../entities/Organization";
import { PropertiesType } from "../entities/Properties";

/**
 * Saves organization data to sessionStorage.
 * @param data Organization[]
 */

// export const saveToSessionStorage = (name:string,data: {userData:PropertiesType,orgData:Organization[]}): void => {
export const saveToSessionStorage = (name:string,data: any): void => {
  sessionStorage.setItem(name, JSON.stringify(data));
};

/**
 * Retrieves organization data from sessionStorage.
 * @returns Organization[] | null
 */
// export const getFromSessionStorage = (name:string): Organization[] | null => {
  export const getFromSessionStorage = (name:string): any | null => {
  const data = sessionStorage.getItem(name);
  return data ? JSON.parse(data) : null;
};


export const saveToLocalStorage = (name: string, data: any): void => {
  localStorage.setItem(name, JSON.stringify(data));
}

export const getFromLocalStorage = (name: string): any | null => {
  const savedData = localStorage.getItem(name);
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    return parsedData
  }
  return null
}