# Event Management System

Welcome to the Event Management System repository! This project aims to provide a robust backend for managing events, tickets, users, and comments. It is built using Node.js, Express, MongoDB. Below, you'll find information on the project structure, features, API endpoints, and how to get started.

## Table of Contents


- [Users](#users)
- [Comments](#comments)
- [Events](#events)
- [Tickets](#tickets)


## Users

### Endpoints

- `POST /users/register`: Register a new user.
- `POST /users/login`: User login.
- `GET /users`: Get information about all users.
- `PUT /users/resetpassword`: Reset user password.
- `GET /users/logout`: Logout user.

### Controller: `authController`

Handles user authentication and registration.

## Comments

### Endpoints

- `POST /comments/:eventId`: Leave a comment on a specific event.
- `GET /comments/`: Get all comments.

### Controller: `commentController`

Manages comments for events.

## Events

### Endpoints

- `GET /events`: Get information about all events.
- `GET /events/:eventId`: Get details of a specific event.
- `POST /events`: Create a new event.
- `PATCH /events/:eventId`: Update event details.
- `DELETE /events/:eventId`: Delete an event.
- `POST /events/rating/:eventId`: Rate an event.

### Controller: `eventController`

Handles CRUD operations for events, including event ratings.

## Tickets

### Endpoints

- `GET /tickets/`: Get information about all tickets.
- `POST /tickets/:eventId`: Purchase a ticket for a specific event.
- `GET /tickets/:ticketId`: Get details of a specific ticket.

### Controller: `ticketController`

Manages ticket-related operations.

## Advanced Features

- Event search by title, date, or location.
- Users can rate events, and an average rating is calculated for each event.
- Soft deletion strategy for events and users.

## Error Handling and Validation

Comprehensive error handling is implemented across all endpoints. Incoming data for creating or updating entities is validated to ensure data integrity.

## Performance Optimization

Appropriate indexing is applied to database tables, and caching is implemented where applicable, especially for listing events.


## Deliverables

### Source Code
The source code of the application is available on [GitHub](https://github.com/AliyanChanegaon/Event-management-system).


Feel free to explore the codebase, contribute, and use this Event Management System as a foundation for your projects! If you have any questions or issues, please open a new [GitHub issue](https://github.com/AliyanChanegaon/Event-management-system/issues).
