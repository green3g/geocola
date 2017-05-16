import {ViewModel} from 'spectre-canjs/nav-container/nav-container';
import template from './sidebar-nav.stache';
import './sidebar.less';
import Component from 'can-component';
import './sidebar-page';

export const SideBarViewModel = ViewModel.extend({
    /**
     * The currently active page
     * @parent nav-container.ViewModel.props
     * @property {nav-page.ViewModel} nav-container.ViewModel.props.activePage activePage
     */
    activePage: {
        get () {
            if (this.collapsed) {
                return null; 
            }
            let active;

            if (!this.pages.length) {
                return null;
            }

            // lookup active page id
            active = this.pages.filter((p) => {
                return p.pageId === this.activeId;
            });

            if (active.length) {
                active = active[0];
            } else {
                active = this.pages[0];
            }

            return active;
        }
    },
    collapsed: {
        type: 'htmlbool'
    },
    makeActive (page) {
        this.collapsed = page === this.activePage;
        ViewModel.prototype.makeActive.apply(this, arguments);
    }
});

export default Component.extend({
    tag: 'sidebar-nav',
    ViewModel: SideBarViewModel,
    view: template,
    leakScope: true
});
