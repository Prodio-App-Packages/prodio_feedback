import { Organization } from "../entities/Organization";

export const getMatchedUrlItem = (url:string, data:Organization[]) => {
    for (const item of data) {
        for (const pattern of item?.allowed_url) {
            // Replace * in the pattern with a regex that matches any string except '/'
            const regexPattern = pattern
                .replace(/\*/g, "[^/]+") // Match any single URL segment (excluding '/')
                .replace(/\/$/, ""); // Normalize trailing slashes

            const regex = new RegExp(`^${regexPattern}$`);

            // Test if the URL matches the pattern
            if (regex.test(url.replace(/\/$/, ""))) {
                return item ; // Return the matching item
            }
        }
    }
    // Return "not found" if no match is found after checking all patterns
    return null;
}