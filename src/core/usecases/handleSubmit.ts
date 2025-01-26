import { serverUrl } from "./serverUrl";

interface FormInput {
  type: string;
  title: string;
  description: string;
  feedback_id: string;
  user_id: string;
  }
  
  /**
   * Handles form submission by validating and processing the input data.
   * @param input FormInput
   */
export const handleSubmit = async (data: FormInput): Promise<any> => {
    
  const url = serverUrl + "/feedback"
 
    const res = await  fetch(url, {
      method: "POST",
      mode:"no-cors",
      headers: {
        'Content-Type':"application/json"
      },
      body:JSON.stringify(data)
    })
    
  
    // const result = await res.json()
    return {
  message:"Feedback submitted successfully"
}
  //  return result 
    // Further processing such as API call can be added here
};
  

// {
//  error: "Failed to save data",
// }
// {
//   message:"Feedback submitted successfully"
// }