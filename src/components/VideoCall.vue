<template>
  <div>
    <div class="mb-25">
      <b>Conference Id:</b><input type="text" v-model="conferenceId" />
    </div>

    <div class="mb-25">
      <button v-if="!connected" @click="connect">Connect to Voxeet</button>
      <div v-else>Connected as "{{ userName }}"</div>
      <button v-if="connected" @click="disconnect">
        Disconnect from Voxeet
      </button>
    </div>

    <div class="mb-25">
      <button @click="create">Create Conference</button>
    </div>

    <div class="mb-25">
      <b>User Name</b><input type="text" v-model="invitedUserName" />
      <button @click="invite">Invite User</button>
    </div>

    <div class="mb-25">
      <button @click="join">Join Conference</button>
    </div>
  </div>
</template>

<script>
import crypto from "crypto";
const {
  VUE_APP_VOXEET_CONSUMER_KEY,
  VUE_APP_VOXEET_CONSUMER_SECRET,
} = process.env;

export default {
  name: "VideoCall",
  components: {},
  data() {
    return {
      connected: false,
      conferenceId: "",

      userName: `test user - ${crypto.randomBytes(1).toString("hex")}`,
      invitedUserName: "",
    };
  },
  methods: {
    async connect() {
      const { Voxeet } = window.VoxeetSDK;

      await Voxeet.initialize(
        VUE_APP_VOXEET_CONSUMER_KEY,
        VUE_APP_VOXEET_CONSUMER_SECRET
      );

      await Voxeet.connect(
        new window.UserInfo(
          this.userName,
          this.userName,
          "https://ucarecdn.com/87659028-3081-4ece-ae0c-f863c28c2030/person_round.png"
        )
      );

      await Voxeet.appearMaximized(true);
      await Voxeet.defaultBuiltInSpeaker(true);
      await Voxeet.defaultVideo(true);

      this.connected = true;
    },
    async create() {
      const { Voxeet } = window.VoxeetSDK;

      const conference = await Voxeet.create({
        alias: "123412341234",
      });

      console.log("conference is", conference);

      this.conferenceId = conference.conferenceId;

      await this.join();
    },
    async join() {
      const { Voxeet } = window.VoxeetSDK;

      console.log("joining conference with id", this.conferenceId);
      await Voxeet.join(this.conferenceId);
    },
    async invite() {
      const { Voxeet } = window.VoxeetSDK;

      const invitingUser = new window.UserInfo(
        this.invitedUserName,
        this.invitedUserName,
        "https://ucarecdn.com/87659028-3081-4ece-ae0c-f863c28c2030/person_round.png"
      );

      console.log(
        `inviting user ${this.invitedUserName} to conference id=${this.conferenceId}`
      );
      await Voxeet.invite(this.conferenceId, [invitingUser]);
    },
    async disconnect() {
      const { Voxeet } = window.VoxeetSDK;

      console.log(`disconnecting from voxeet`);
      await Voxeet.disconnect();
    },
  },
};
</script>

<style>
.mb-25 {
  margin-bottom: 25px;
}
</style>
