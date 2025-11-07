import { Inngest } from "inngest";
import User from "../models/user.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });


// Inngest function to store user to a database
const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk' },
    { event: "clerk/user.created" },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + " " + last_name,
            image: image_url
        }
        // Here, you would add code to save userData to your database
        await User.create(userData)
    }
)

// Inngest function to delete user from database when deleted in Clerk
const syncUserDeletion = inngest.createFunction(
    { id: 'delete-user-with-clerk' },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        const { id } = event.data;
        // Here, you would add code to delete the user from your database
        await User.findByIdAndDelete(id)
    }
)

// Inngest function to update user info in database when updated in Clerk
const syncUserUpdate = inngest.createFunction(
    { id: 'update-user-from-clerk' },
    { event: "clerk/user.updated" },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const updatedData = {
            _id: id,
            name: first_name + " " + last_name,
            email: email_addresses[0].email_address,
            image: image_url
        }
        // Here, you would add code to update the user in your database
        await User.findByIdAndUpdate(id, updatedData)
    }
)


// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdate];