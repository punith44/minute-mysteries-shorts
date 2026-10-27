import React from "react";
import { FeltPenCircle } from "../FeltPenAnnotation";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { clamp, easeOutCubic, evaluateSpring } from "../../engine/motionPhysics";
import type { WidgetSpec } from "../../schema/reelSchema";

type NotificationStackSpec = Extract<WidgetSpec, { type: "notification_stack" }>;

interface NotificationStackCardProps {
  spec: NotificationStackSpec;
  currentTimeSec: number;
  springOvershoot?: number;
}

/**
 * Multi-Card Tilted Notification Phone + Profile Counter + Red Toast Pill + Flip Calendar
 * Exact 1080×1920 recreation of Video-1328 Scene 01 & baseline HTML inspector.
 */
export const NotificationStackCard: React.FC<NotificationStackCardProps> = ({
  spec,
  currentTimeSec,
  springOvershoot = 0.45,
}) => {
  // 1. Left Phone Card Entrance (Tilted -5 deg)
  const notifProg = clamp((currentTimeSec - 0.12) / 0.55, 0, 1);
  const notifSpring = evaluateSpring(notifProg, springOvershoot);
  const notifOpacity = clamp((currentTimeSec - 0.12) / 0.1, 0, 1);

  // 2. Right Profile Counter Card Entrance (Tilted +3.5 deg)
  const profProg = clamp((currentTimeSec - 0.32) / 0.55, 0, 1);
  const profSpring = evaluateSpring(profProg, springOvershoot);
  const profOpacity = clamp((currentTimeSec - 0.32) / 0.1, 0, 1);

  // 3. Follower Count Interpolation
  const countProgress = easeOutCubic((currentTimeSec - 0.35) / 2.2);
  const currentFollowers = Math.floor(
    spec.followersFrom + (spec.followersTo - spec.followersFrom) * countProgress
  );
  const formattedFollowers =
    currentFollowers > 39000 ? "39.5K" : currentFollowers.toLocaleString();

  // 4. Red Toast Pill Badge
  const toastProg = clamp((currentTimeSec - 0.75) / 0.48, 0, 1);
  const toastSpring = evaluateSpring(toastProg, springOvershoot + 0.1);
  const toastOpacity = clamp((currentTimeSec - 0.75) / 0.08, 0, 1);
  const toastNum = Math.min(
    spec.toastIncrement,
    Math.floor(6 + countProgress * (spec.toastIncrement - 6))
  );

  // 5. Optional Flip Calendar Card Slam
  const cal = spec.calendarDay;
  const calStart = cal ? cal.enterAt - 0.15 : 999;
  const calProg = clamp((currentTimeSec - calStart) / 0.48, 0, 1);
  const calSpring = evaluateSpring(calProg, springOvershoot + 0.15);
  const calOpacity = clamp((currentTimeSec - calStart) / 0.06, 0, 1);
  const calDayVal = cal
    ? Math.min(
        cal.dayNumber,
        Math.max(
          1,
          Math.floor(1 + clamp((currentTimeSec - calStart) / 0.38, 0, 1) * (cal.dayNumber - 1))
        )
      )
    : 1;

  return (
    <div
      style={{
        position: "relative",
        width: 980,
        height: 760,
      }}
    >
      {/* 1. LEFT PHONE NOTIFICATIONS CARD */}
      <div
        style={{
          position: "absolute",
          left: 16,
          top: 20,
          width: 560,
          backgroundColor: "#141416",
          color: "#FFFFFF",
          borderRadius: 52,
          padding: 34,
          border: `5px solid ${COLORS.ink}`,
          boxShadow: "0 36px 65px -12px rgba(17, 17, 17, 0.32)",
          transform: `translateY(${((1 - notifSpring) * 180).toFixed(1)}px) scale(${(
            0.65 +
            0.35 * notifSpring
          ).toFixed(3)}) rotate(${(-5 * notifSpring).toFixed(2)}deg)`,
          opacity: notifOpacity,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#A1A1AA",
            paddingBottom: 20,
            borderBottom: "2px solid #27272A",
            fontFamily: FONTS.sans,
          }}
        >
          <span>9:41</span>
          <span style={{ fontWeight: 700, color: "#FFFFFF", fontSize: 28 }}>
            Notifications
          </span>
          <span>+</span>
        </div>

        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#D4D4D8",
            marginTop: 18,
            marginBottom: 14,
          }}
        >
          New
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {spec.notifications.map((item, idx) => {
            const rp = clamp((currentTimeSec - item.enterAt) / 0.32, 0, 1);
            const rs = evaluateSpring(rp, springOvershoot * 0.8);
            const rowOpacity = clamp((currentTimeSec - item.enterAt) / 0.08, 0, 1);
            const isFollowing = item.btn === "Following";

            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 14,
                  backgroundColor: "rgba(24, 24, 27, 0.92)",
                  padding: "14px 18px",
                  borderRadius: 20,
                  border: "1.5px solid #27272A",
                  transform: `translateX(${((1 - rs) * -60).toFixed(1)}px) scale(${(
                    0.85 +
                    0.15 * rs
                  ).toFixed(3)})`,
                  opacity: rowOpacity,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      backgroundColor: item.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      fontWeight: 800,
                      color: "#FFFFFF",
                      flexShrink: 0,
                    }}
                  >
                    {item.init}
                  </span>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF" }}>
                      {item.user}{" "}
                      <span style={{ color: "#A1A1AA", fontWeight: 500 }}>
                        {item.time}
                      </span>
                    </div>
                    <div style={{ fontSize: 18, color: "#A1A1AA" }}>
                      started following you.
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    padding: "8px 20px",
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: 20,
                    backgroundColor: isFollowing ? "#27272A" : "#2563EB",
                    color: isFollowing ? "#D4D4D8" : "#FFFFFF",
                  }}
                >
                  {item.btn}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. RIGHT OVERLAPPING PROFILE COUNTER CARD */}
      <div
        style={{
          position: "absolute",
          right: 12,
          top: 90,
          width: 495,
          backgroundColor: "#18181B",
          color: "#FFFFFF",
          borderRadius: 38,
          padding: 34,
          border: `4.5px solid ${COLORS.ink}`,
          boxShadow: "0 36px 65px -12px rgba(17, 17, 17, 0.35)",
          transform: `translateY(${((1 - profSpring) * 210).toFixed(1)}px) scale(${(
            0.65 +
            0.35 * profSpring
          ).toFixed(3)}) rotate(${(3.5 * profSpring).toFixed(2)}deg)`,
          opacity: profOpacity,
          zIndex: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 24,
          }}
        >
          <span>{spec.profileHandle}</span>
          <span
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              backgroundColor: COLORS.signalRed,
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            textAlign: "center",
            margin: "20px 0",
            position: "relative",
          }}
        >
          <div>
            <div style={{ fontSize: 34, fontWeight: 800 }}>{spec.postsCount}</div>
            <div style={{ fontSize: 20, color: "#A1A1AA" }}>posts</div>
          </div>

          <div
            style={{
              padding: "10px 22px",
              borderRadius: 18,
              backgroundColor: "rgba(232, 64, 42, 0.16)",
              border: "2px solid rgba(232, 64, 42, 0.45)",
              position: "relative",
            }}
          >
            <div style={{ fontSize: 38, fontWeight: 800, color: "#FFFFFF" }}>
              {formattedFollowers}
            </div>
            <div
              style={{
                fontSize: 20,
                color: COLORS.signalRed,
                fontFamily: FONTS.mono,
                fontWeight: 700,
              }}
            >
              followers
            </div>
            <FeltPenCircle
              delay={18}
              width={185}
              height={95}
              style={{ top: -6, left: -12 }}
            />
          </div>

          <div>
            <div style={{ fontSize: 34, fontWeight: 800 }}>
              {spec.followingCount}
            </div>
            <div style={{ fontSize: 20, color: "#A1A1AA" }}>following</div>
          </div>
        </div>

        <div style={{ fontSize: 22, color: "#A1A1AA", marginTop: 14 }}>
          {spec.bioLine}
        </div>
      </div>

      {/* 3. RED NEW FOLLOWERS TOAST PILL */}
      <div
        style={{
          position: "absolute",
          right: 85,
          bottom: 95,
          backgroundColor: COLORS.signalRed,
          color: "#FFFFFF",
          padding: "18px 38px",
          borderRadius: 32,
          border: `4.5px solid ${COLORS.ink}`,
          boxShadow: "0 24px 40px -8px rgba(17, 17, 17, 0.3)",
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontFamily: FONTS.sans,
          fontWeight: 800,
          fontSize: 42,
          transform: `scale(${toastSpring.toFixed(3)}) rotate(${(
            -3 * toastSpring
          ).toFixed(2)}deg)`,
          opacity: toastOpacity,
          zIndex: 30,
        }}
      >
        <span>●</span>
        <span>+{toastNum}</span>
      </div>

      {/* 4. FLIP CALENDAR "DAY 35" CARD SLAM */}
      {cal && currentTimeSec >= calStart && (
        <div
          style={{
            position: "absolute",
            right: 28,
            top: 8,
            width: 340,
            backgroundColor: "#FFFFFF",
            color: COLORS.ink,
            borderRadius: 30,
            border: `5px solid ${COLORS.ink}`,
            boxShadow: "0 30px 55px -10px rgba(17, 17, 17, 0.35)",
            overflow: "hidden",
            transform: `translateY(${((1 - calSpring) * -130).toFixed(1)}px) scale(${(
              0.5 +
              0.5 * calSpring
            ).toFixed(3)}) rotate(${(8 * calSpring).toFixed(2)}deg)`,
            opacity: calOpacity,
            zIndex: 40,
          }}
        >
          <div
            style={{
              backgroundColor: COLORS.ink,
              color: "#FFFFFF",
              fontSize: 22,
              fontFamily: FONTS.mono,
              fontWeight: 700,
              letterSpacing: "0.14em",
              padding: "12px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>// DAY</span>
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                backgroundColor: COLORS.signalRed,
              }}
            />
          </div>
          <div style={{ padding: "22px 20px", textAlign: "center" }}>
            <div
              style={{
                fontSize: 96,
                lineHeight: 1,
                fontFamily: FONTS.sans,
                fontWeight: 800,
                color: COLORS.ink,
                letterSpacing: "-0.04em",
              }}
            >
              {calDayVal}
            </div>
            <div
              style={{
                fontSize: 22,
                fontFamily: FONTS.mono,
                color: "#71717A",
                marginTop: 6,
              }}
            >
              {cal.label}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
