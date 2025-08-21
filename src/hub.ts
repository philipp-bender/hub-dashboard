import { version } from "../package.json";

import "./localize"
import "./shared/modal/modal";
import "./shared/base-button-card/base-button-card";
import "./shared/base-action-card/base-action-card";
import "./shared/toggle-switch/toggle-switch";
import "./shared/progress-overlay/progress-overlay";
import "./shared/slider-input/slider-input";
import "./components/view/view";
import "./components/button-card/button-card";
import "./components/round-button/round-button";
import "./components/container-group/container-group";
import "./chips/light-chip/light-chip";
import "./chips/binary-sensor-chip/binary-sensor-chip";
import "./cards/light-card/light-card";
import "./cards/cover-card/cover-card";
import "./cards/switch-card/switch-card";
import "./cards/climate-card/climate-card";

console.info(`%c Hub Dashboard - ${version}`, "color:rgb(0, 99, 198); font-weight: 700;");
