const {
  getConversationController,
  sendMessageController,
  getInboxConversationController,
  getInboxAllConversationsController,
  getConversationByConversationIdController,
} = require("../controllers/conversationController");
const checkAuth = require("../middlewares/authMiddleware");

const router = require("express").Router();

// get conversation by conversation and order id
router.get("/:conversationId/:orderId", checkAuth, getConversationController);

// get all inbox conversations
router.get("/all-inbox", checkAuth, getInboxAllConversationsController);

// get inbox conversation
router.get("/conversation-inbox", checkAuth, getInboxConversationController);

// get conversation by conversationId
router.get(
  "/:conversationId",
  checkAuth,
  getConversationByConversationIdController
);

// send message
router.post("/send-message", checkAuth, sendMessageController);

module.exports = router;
