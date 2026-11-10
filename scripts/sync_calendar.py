#!/usr/bin/env python3
"""
Syncs Tower Hill Band's public Google Calendar (th.2.web@gmail.com)
into demov1/data/shows.json for fast, accessible rendering on GitHub Pages.
"""

import json
import os
import re
import urllib.request
from datetime import datetime
from zoneinfo import ZoneInfo

ICAL_URL = "https://calendar.google.com/calendar/ical/th.2.web%40gmail.com/public/basic.ics"
CALENDAR_EMBED_URL = (
    "https://calendar.google.com/calendar/embed?height=610&wkst=1"
    "&ctz=America%2FNew_York&mode=MONTH&showTitle=1&showNav=1&showDate=1"
    "&showPrint=0&showTabs=1&showCalendars=0&showTz=1"
    "&src=th.2.web%40gmail.com&color=%23E21C21"
)
OUTPUT_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "demov1", "data", "shows.json")


def clean_ical_text(val: str) -> str:
    if not val:
        return ""
    val = val.replace("\\,", ",").replace("\\;", ";").replace("\\n", " ").replace("\\N", " ")
    return re.sub(r"\s+", " ", val).strip()


def extract_city_state(location: str, summary: str) -> str:
    # Look for "Town, MA" or "Town, RI" or "Town, NH"
    m = re.search(r"([A-Za-z\s\.]+),\s*(MA|RI|NH|CT|ME|VT)\b", location)
    if m:
        city = m.group(1).split(",")[-1].strip()
        # Remove street suffixes if accidentally captured
        for prefix in ["St", "Dr", "Dr.", "Ave", "Rd", "Ln", "Blvd", "Main St", "Broadway", "Ashland St", "Westgate Dr", "Westgate Dr."]:
            if city.endswith(prefix):
                pass
        return f"{city}, {m.group(2)}"
    if " - " in summary:
        return summary.split(" - ")[-1].strip()
    return "South Shore, MA"


def parse_city_clean(location: str, summary: str) -> str:
    parts = [p.strip() for p in location.split(",") if p.strip()]
    for i, part in enumerate(parts):
        m = re.match(r"^(MA|RI|NH|CT)\b", part)
        if m and i > 0:
            city_candidate = parts[i - 1]
            # Handle case like "65 Westgate Dr. Brockton"
            if "Brockton" in city_candidate:
                return f"Brockton, {m.group(1)}"
            return f"{city_candidate}, {m.group(1)}"
    if "Brockton" in location or "Brockton" in summary:
        return "Brockton, MA"
    if "Randolph" in location or "Randolph" in summary:
        return "Randolph, MA"
    if "Hanson" in location or "Hanson" in summary:
        return "Hanson, MA"
    if "Avon" in location or "Avon" in summary:
        return "Avon, MA"
    if "Bridgewater" in location or "Bridgewater" in summary:
        return "Bridgewater, MA"
    if "Pawtucket" in location or "Pawtucket" in summary:
        return "Pawtucket, RI"
    if "Raynham" in location or "Raynham" in summary:
        return "Raynham, MA"
    return "South Shore, MA"


def infer_event_note(venue: str, dt_start: datetime) -> str:
    v_low = venue.lower()
    if dt_start.month == 12 and dt_start.day == 31:
        return "New Year's Eve Bash • Ring in the New Year with live rock!"
    if "westgate" in v_low:
        return "Live at Westgate Pub & Lanes • Great food, drinks & rock covers"
    if "tommy doyle" in v_low or "sidelines" in v_low:
        return "Saturday Night Rock Party • Classic & modern rock hits"
    if "indian head" in v_low or "j&r" in v_low:
        return "South Shore Pub Night • High-energy rock & pop favorites"
    if "amvets" in v_low:
        return "Live at Randolph Amvets Post 51 • Dancing & classic rock"
    if "black hat" in v_low:
        return "Taproom Live Music • Craft beer & live rock"
    if "badger" in v_low:
        return "Rhode Island Road Show • Live rock covers all night"
    return "Live Rock & Pop Covers • No cover / Call venue for details"


def main():
    req = urllib.request.Request(ICAL_URL, headers={"User-Agent": "TowerHillSiteSync/1.0"})
    raw = urllib.request.urlopen(req, timeout=15).read().decode("utf-8", errors="ignore")
    unfolded = re.sub(r"\r?\n[ \t]", "", raw)
    vevents = re.findall(r"BEGIN:VEVENT(.*?)END:VEVENT", unfolded, re.S)

    ny_tz = ZoneInfo("America/New_York")
    utc_tz = ZoneInfo("UTC")

    shows = []
    for ev in vevents:
        dtstart_m = re.search(r"DTSTART[^:]*:(\S+)", ev)
        dtend_m = re.search(r"DTEND[^:]*:(\S+)", ev)
        summary_m = re.search(r"SUMMARY:(.*)", ev)
        loc_m = re.search(r"LOCATION:(.*)", ev)
        uid_m = re.search(r"UID:(.*)", ev)

        if not dtstart_m or not summary_m:
            continue

        s_raw = dtstart_m.group(1).strip()
        e_raw = dtend_m.group(1).strip() if dtend_m else ""

        # Filter to 2026+ shows
        if s_raw < "20260101" or "T" not in s_raw:
            continue

        dt_start = datetime.strptime(s_raw, "%Y%m%dT%H%M%SZ").replace(tzinfo=utc_tz).astimezone(ny_tz)
        dt_end = (
            datetime.strptime(e_raw, "%Y%m%dT%H%M%SZ").replace(tzinfo=utc_tz).astimezone(ny_tz)
            if e_raw and "T" in e_raw
            else dt_start
        )

        venue = clean_ical_text(summary_m.group(1))
        location = clean_ical_text(loc_m.group(1)) if loc_m else ""
        city_state = parse_city_clean(location, venue)

        # Clean up venue display title if city is appended
        venue_clean = re.sub(r"\s*-\s*(Hanson|Brockton|Avon|Randolph|Raynham|Pawtucket\s*RI)\b.*", "", venue, flags=re.I).strip()

        start_time_str = dt_start.strftime("%-I:%M %p")
        # Round :55 or :59 end times to clean hour for display
        if dt_end.minute in (55, 59):
            end_hour = (dt_end.hour + 1) % 24
            ampm = "AM" if end_hour < 12 else "PM"
            disp_h = 12 if end_hour % 12 == 0 else end_hour % 12
            end_time_str = f"{disp_h}:00 {ampm}"
        else:
            end_time_str = dt_end.strftime("%-I:%M %p")

        maps_query = urllib.parse.quote_plus(f"{venue_clean}, {location}" if location else f"{venue_clean}, {city_state}")

        shows.append({
            "id": clean_ical_text(uid_m.group(1)) if uid_m else s_raw,
            "isoStart": dt_start.isoformat(),
            "isoEnd": dt_end.isoformat(),
            "icalStart": s_raw,
            "icalEnd": e_raw,
            "year": dt_start.year,
            "monthShort": dt_start.strftime("%b").upper(),
            "monthName": dt_start.strftime("%B"),
            "dayNum": dt_start.strftime("%-d"),
            "dayPadded": dt_start.strftime("%d"),
            "weekdayShort": dt_start.strftime("%a").upper(),
            "weekdayFull": dt_start.strftime("%A"),
            "dateFormatted": dt_start.strftime("%a, %b %-d, %Y"),
            "badgeShort": dt_start.strftime("%b %-d"),
            "timeRange": f"{start_time_str} – {end_time_str}",
            "venue": venue_clean,
            "venueRaw": venue,
            "city": city_state,
            "address": location.replace(", USA", "").replace(", United States", ""),
            "note": infer_event_note(venue, dt_start),
            "mapsUrl": f"https://www.google.com/maps/search/?api=1&query={maps_query}",
            "isNewYearsEve": (dt_start.month == 12 and dt_start.day == 31)
        })

    shows.sort(key=lambda x: x["isoStart"])

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    payload = {
        "calendarId": "th.2.web@gmail.com",
        "calendarEmbedUrl": CALENDAR_EMBED_URL,
        "calendarIcsUrl": ICAL_URL,
        "lastSyncedUtc": datetime.now(utc_tz).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "shows": shows
    }

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)

    print(f"Synced {len(shows)} shows from th.2.web@gmail.com -> {OUTPUT_PATH}")


if __name__ == "__main__":
    main()

