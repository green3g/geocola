import {PageViewModel} from 'spectre-canjs/nav-container/nav-container';
import canViewModel from 'can-view-model';
import Component from 'can-component';
import pageTemplate from './sidebar-page.stache';

export const SidebarPageViewModel = PageViewModel.extend({
    iconClass: 'string',
    collapse () {
        if (this.parent) {
            this.parent.collapsed = true;
        }
    }
});


export default Component.extend({
    tag: 'sidebar-page',
    view: pageTemplate,
    ViewModel: SidebarPageViewModel,
    events: {
        inserted: function () {
            this.viewModel.parent = canViewModel(this.element.parentNode);
            if (this.viewModel.parent && this.viewModel.parent.addPage) {
                this.viewModel.parent.addPage(this.viewModel);
            }
        },
        removed: function () {
            if (this.viewModel.parent && this.viewModel.parent.removePage) {
                this.viewModel.parent.removePage(this.viewModel);
            }
            this.viewModel.parent = null;
        }
    }
});
