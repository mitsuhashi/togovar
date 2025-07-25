import { setAdvancedSearchCondition } from '../store/searchManager';
import ConditionGroupView from './ConditionGroupView.js';
import AdvancedSearchToolbar from './AdvancedSearchToolbar.js';
import AdvancedSearchSelection from './AdvancedSearchSelection.js';
// import {ADVANCED_CONDITIONS} from '../global.js';
// import {API_URL} from "../global.js";
import { CONDITION_ITEM_TYPE } from '../definition.js';

export default class AdvancedSearchBuilderView {
  constructor(elm) {
    this._elm = elm;
    this._container = elm.querySelector(':scope > .inner');
    this._rootGroup = new ConditionGroupView(this, this, 'and', [], null, true);

    // toolbar
    this._toolbar = new AdvancedSearchToolbar(
      this,
      this._rootGroup.maketToolbar()
    );

    // events
    // storeManager.bind('advancedSearchConditions', this);
    this._defineEvents();

    // select conditions
    this._selection = new AdvancedSearchSelection(this._rootGroup.elm, this);
  }

  // public methods

  // advancedSearchConditions(values) {
  //   console.log(values);
  // }

  /**
   *
   * @param {Array} conditionViews
   */
  selectedConditionViews(conditionViews) {
    // change status
    let canUngroup = false;
    let canCopy = false;
    if (conditionViews.length === 1) {
      canUngroup = conditionViews[0].type === CONDITION_ITEM_TYPE.group;
      canCopy = conditionViews[0].type === CONDITION_ITEM_TYPE.condition;
    }
    // can delete
    this._elm.dataset.canDelete = conditionViews.length > 0;
    // can group
    this._elm.dataset.canGroup =
      conditionViews.length > 1 &&
      conditionViews[0].siblingElms.length > conditionViews.length;
    // can ungroup
    this._elm.dataset.canUngroup = canUngroup;
    // can copy
    this._elm.dataset.canCopy = canCopy;
    // can edit
    // TODO:
  }

  // deselectedConditions(conditions) {
  //   console.log(conditions)
  // }

  // addConditions(conditions) {

  // }

  // removeConditions(conditions) {

  // }

  changeCondition() {
    const query = this._rootGroup.query;
    this.search();
  }

  group() {
    const conditionViews = this._selection.getSelectingConditionViews();
    const parentGroupView = conditionViews[0].parentView;
    // insert position
    const siblingViews = parentGroupView.childViews;
    let position = Infinity,
      referenceElm = null;
    conditionViews.forEach((view) => {
      const index = siblingViews.indexOf(view);
      if (index < position) {
        position = index;
        referenceElm = view.elm;
      }
    });
    // add new gropu
    const conditionGroupView = parentGroupView.addNewConditionGroup(
      conditionViews,
      referenceElm
    );
    this._selection.selectConditionView(conditionGroupView, true);
    this.changeCondition();
  }

  ungroup() {
    const conditionViews = this._selection.getSelectingConditionViews();
    // deselect selecting group
    conditionViews.forEach((conditionView) => {
      this._selection.deselectConditionView(conditionView);
    });
    // ungroup
    conditionViews[0].ungroup();
    this.changeCondition();
  }

  // copy() {
  //   console.log('_copy')
  //   const selectingConditionViews = this._selection.getSelectingConditionViews();
  //   // TODO:
  //   this.changeCondition();
  // }

  // edit() {
  //   console.log('_edit')
  //   this.changeCondition();
  // }

  /**
   *
   * @param {Array<ConditionView>} views
   */
  delete(views) {
    const conditionViews =
      views ?? this._selection.getSelectingConditionViews();
    for (const view of conditionViews) {
      view.remove();
      this._selection.deselectConditionView(view);
    }
    this.changeCondition();
  }

  search() {
    const query = this._rootGroup.query;

    setAdvancedSearchCondition(query);
  }

  // add search condition to the currently selected layer
  addCondition(conditionType, options) {
    // get selecting condition
    const selectingConditionViews =
      this._selection.getSelectingConditionViews();
    const selectingConditionView =
      selectingConditionViews.length > 0
        ? selectingConditionViews[0]
        : this._rootGroup;

    // release exist conditions
    this._selection.deselectAllConditions();

    // add
    switch (selectingConditionView.type) {
      case CONDITION_ITEM_TYPE.condition:
        // TODO: コンディションを選択していた場合に、その後ろに新規条件を追加
        break;
      case CONDITION_ITEM_TYPE.group:
        selectingConditionView.addNewConditionItem(conditionType, options);
        break;
    }
  }

  // private methods

  _defineEvents() {
    let downX, downY;
    this._elm.addEventListener('mousedown', (e) => {
      [downX, downY] = [e.x, e.y];
    });
    this._elm.addEventListener('click', (e) => {
      if (Math.abs(downX - e.x) > 2 || Math.abs(downY - e.y) > 2) return;
      e.stopImmediatePropagation();
      this._selection.deselectAllConditions();
    });
  }

  // accessor

  get elm() {
    return this._elm;
  }

  get container() {
    return this._container;
  }

  get selection() {
    return this._selection;
  }
}
