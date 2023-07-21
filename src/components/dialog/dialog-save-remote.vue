<template>

	<div>
		<app-dialog-header>Save Hand History on Server</app-dialog-header>
		<app-dialog-body v-show="!isCollapsed">

			<div class="divorced bm-l">

				<button :class="['css-button', saveStyleState]" :disabled="!isSaveEnabled" @click="onSaveClick">
					<span class="css-button-icon"><i class="fa fa-globe" aria-hidden="true"></i></span>
					<span class="css-button-text">Save</span>
				</button>

			</div>

		</app-dialog-body>

	</div>

</template>

<script>

import DialogHeader from './dialog-header.vue';
import DialogBody from './dialog-body.vue';
import { db } from '../../db';

export default {

	components: {
		'app-dialog-header': DialogHeader,
		'app-dialog-body': DialogBody
	},

	data() {

		return {

			isSaveEnabled: false,
			isCollapsed: false
		}
	},

	methods: {

		async onSaveClick() {
			console.log('??????????');

			const { view } = this.$root.$data;
			const result = view.tryGetHandHistory();
			console.log(view, result);

			if (result.success) {

				const { handId, handDate } = view.mainInfoVue.values;

				const { hh } = result;

				const item = { handId, handDate, hh, note: 'Note:' };

				console.log(handId, item)
				await db.collection('test').add(item)


				// const resultInsert = ls.insertItem(item);
				const resultInsert = {
					success: true
				}

				if (resultInsert.success) {

					view.showSmallTopRightSuccessfully();
					this.isSaveEnabled = false;

				} else view.showGenericError();

			}
		},

		tryEnableSaveButton() {

			const { view } = this.$root.$data;
			const result = view.tryGetHandHistory({ alert: false });

			if (result.success) {

				// const item = ls.getItems().find(i => i.hh === result.hh);

				this.isSaveEnabled = true;
			}
		}

	},

	computed: {

		saveStyleState() {

			return `button--${this.isSaveEnabled ? 'blue' : 'disabled'}`;
		}
	}
}

</script>

<style scoped>
</style>