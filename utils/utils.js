export const animationCreate = () => {
    if (typeof window !== "undefined") {
        import('wowjs').then((module) => {
            const WOW = module.WOW;
            console.log("WOW after import:", WOW); // Log to check the value of WOW

            if (WOW) {
                try {
                    new WOW({ live: false }).init();
                } catch (error) {
                    console.error("Error while initializing WOW:", error);
                }
            } else {
                console.error("WOW is not defined.");
            }
        }).catch((error) => {
            console.error("Error while importing wowjs:", error);
        });
    } else {
        console.error("window is undefined.");
    }
};
