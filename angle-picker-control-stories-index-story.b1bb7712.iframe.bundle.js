"use strict";(globalThis.webpackChunkgutenberg=globalThis.webpackChunkgutenberg||[]).push([[970],{"./packages/compose/build-module/hooks/use-merge-refs/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>useMergeRefs});var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function assignRef(ref,value){"function"==typeof ref?ref(value):ref&&ref.hasOwnProperty("current")&&(ref.current=value)}function useMergeRefs(refs){const element=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(),isAttached=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(!1),didElementChange=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(!1),previousRefs=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)([]),currentRefs=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(refs);return currentRefs.current=refs,(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)((()=>{!1===didElementChange.current&&!0===isAttached.current&&refs.forEach(((ref,index)=>{const previousRef=previousRefs.current[index];ref!==previousRef&&(assignRef(previousRef,null),assignRef(ref,element.current))})),previousRefs.current=refs}),refs),(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)((()=>{didElementChange.current=!1})),(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)((value=>{assignRef(element,value),didElementChange.current=!0,isAttached.current=null!==value;const refsToAssign=value?currentRefs.current:previousRefs.current;for(const ref of refsToAssign)assignRef(ref,value)}),[])}},"./packages/components/src/angle-picker-control/stories/index.story.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,default:()=>__WEBPACK_DEFAULT_EXPORT__});var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/index.js"),___WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/components/src/angle-picker-control/index.tsx"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js");const __WEBPACK_DEFAULT_EXPORT__={title:"Components/AnglePickerControl",component:___WEBPACK_IMPORTED_MODULE_1__.o,argTypes:{as:{control:{type:null}},value:{control:{type:null}}},parameters:{sourceLink:"packages/components/src/angle-picker-control",badges:[],actions:{argTypesRegex:"^on.*"},controls:{expanded:!0},docs:{canvas:{sourceState:"shown"}}}},AnglePickerWithState=({onChange,...args})=>{const[angle,setAngle]=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(0);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(___WEBPACK_IMPORTED_MODULE_1__.o,{...args,value:angle,onChange:newValue=>{setAngle(newValue),onChange(newValue)}})};AnglePickerWithState.displayName="AnglePickerWithState";const Default=AnglePickerWithState.bind({});Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"({\n  onChange,\n  ...args\n}) => {\n  const [angle, setAngle] = useState<number>(0);\n  const handleChange = (newValue: number) => {\n    setAngle(newValue);\n    onChange(newValue);\n  };\n  return <AnglePickerControl {...args} value={angle} onChange={handleChange} />;\n}",...Default.parameters?.docs?.source}}}}}]);