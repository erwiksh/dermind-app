const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../services/event.service");

const {
  successResponse,
  errorResponse,
} = require("../utils/response");

exports.index = async (req, res) => {
  try {
    const events = await getAllEvents();

    return successResponse(
      res,
      "Events fetched successfully",
      events
    );
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.show = async (req, res) => {
  try {
    const event = await getEventById(
      req.params.id
    );

    if (!event) {
      return errorResponse(
        res,
        "Event not found",
        404
      );
    }

    return successResponse(
      res,
      "Event fetched successfully",
      event
    );
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.store = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      image,
      event_date,
    } = req.body;

    const event = await createEvent(
      title,
      description,
      location,
      image,
      event_date
    );

    return successResponse(
      res,
      "Event created successfully",
      event,
      201
    );
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.update = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      image,
      event_date,
    } = req.body;

    const event = await updateEvent(
      req.params.id,
      title,
      description,
      location,
      image,
      event_date
    );

    return successResponse(
      res,
      "Event updated successfully",
      event
    );
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.destroy = async (req, res) => {
  try {
    await deleteEvent(req.params.id);

    return successResponse(
      res,
      "Event deleted successfully"
    );
  } catch (error) {
    return errorResponse(res, error.message);
  }
};