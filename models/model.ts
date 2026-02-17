import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const taskSchema = new mongoose.Schema(
  {
    name: String,
    belongTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    members: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

const invitationSchema = new mongoose.Schema({

  belongsTo :{
    type: String,
    ref: "User",
    required: true
  },

  invitedBy: {
    type: String,
    ref: "User",
    required: true
  },

  projectId : {
    type: String,
    ref: 'Project',
    required: true
  },

  message: {
    type: String,
    default: ""
  }

})

export const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);

export const User = mongoose.models.User || mongoose.model("User", userSchema);

export const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);
export const Invitation = mongoose.models.Invitation || mongoose.model("Invitation", invitationSchema);
