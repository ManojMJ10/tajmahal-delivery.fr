"use client";

import { useEffect, useState } from "react";
import { defaultMenu } from "@/data/defaultMenu";
import { defaultSettings } from "@/data/defaultSettings";
import type { AppSettings, Language, MenuItem } from "@/lib/types";

const MENU_KEY = "tajmahal-menu-items";
const SETTINGS_KEY = "tajmahal-settings";
const LANGUAGE_KEY = "tajmahal-language";
const CATALOG_VERSION_KEY = "tajmahal-catalog-version";
const STORE_EVENT = "tajmahal-store-updated";
const CATALOG_VERSION = "2026-05-27-official-menu-v2";

type StoreKey = typeof MENU_KEY | typeof SETTINGS_KEY | typeof LANGUAGE_KEY;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function emitStoreUpdate(key: StoreKey) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(STORE_EVENT, { detail: { key } }));
}

function readStorage<T>(key: StoreKey, fallback: T): T {
  if (typeof window === "undefined") return clone(fallback);
  const raw = window.localStorage.getItem(key);
  if (!raw) return clone(fallback);

  try {
    return JSON.parse(raw) as T;
  } catch {
    return clone(fallback);
  }
}

function writeStorage<T>(key: StoreKey, value: T): T {
  if (typeof window === "undefined") return value;
  window.localStorage.setItem(key, JSON.stringify(value));
  emitStoreUpdate(key);
  return value;
}

function touchSettings(settings: AppSettings): AppSettings {
  return { ...settings, updatedAt: new Date().toISOString() };
}

function touchMenu(items: MenuItem[]): MenuItem[] {
  const timestamp = new Date().toISOString();
  return items.map((item) => ({ ...item, updated_at: item.updated_at || timestamp }));
}

export function getMenuItems(): MenuItem[] {
  return readStorage<MenuItem[]>(MENU_KEY, defaultMenu);
}

export function saveMenuItems(items: MenuItem[]): MenuItem[] {
  const nextItems = items.map((item) => ({
    ...item,
    updated_at: item.updated_at || new Date().toISOString(),
  }));
  updateSettingsTimestamp();
  return writeStorage<MenuItem[]>(MENU_KEY, nextItems);
}

export function addMenuItem(item: MenuItem): MenuItem[] {
  return saveMenuItems([...getMenuItems(), item]);
}

export function updateMenuItem(id: string, updates: Partial<MenuItem>): MenuItem[] {
  return saveMenuItems(
    getMenuItems().map((item) =>
      item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
    )
  );
}

export function deleteMenuItem(id: string): MenuItem[] {
  return saveMenuItems(getMenuItems().filter((item) => item.id !== id));
}

export function getSettings(): AppSettings {
  return readStorage<AppSettings>(SETTINGS_KEY, defaultSettings);
}

export function saveSettings(settings: AppSettings): AppSettings {
  return writeStorage<AppSettings>(SETTINGS_KEY, touchSettings(settings));
}

export function getLanguage(): Language {
  return readStorage<Language>(LANGUAGE_KEY, "fr");
}

export function saveLanguage(language: Language): Language {
  return writeStorage<Language>(LANGUAGE_KEY, language);
}

function updateSettingsTimestamp() {
  if (typeof window === "undefined") return;
  const current = getSettings();
  writeStorage<AppSettings>(SETTINGS_KEY, touchSettings(current));
}

function subscribeKey<T>(key: StoreKey, getter: () => T, initialValue: T) {
  const [state, setState] = useState<T>(initialValue);

  useEffect(() => {
    setState(getter());

    const onStorage = (event: StorageEvent) => {
      if (event.key === key) {
        setState(getter());
      }
    };

    const onCustom = (event: Event) => {
      const detail = (event as CustomEvent<{ key?: string }>).detail;
      if (detail?.key === key) {
        setState(getter());
      }
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(STORE_EVENT, onCustom);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(STORE_EVENT, onCustom);
    };
  }, [getter, key]);

  return state;
}

export function useMenuItems() {
  return subscribeKey<MenuItem[]>(MENU_KEY, getMenuItems, clone(defaultMenu));
}

export function useSettings() {
  return subscribeKey<AppSettings>(SETTINGS_KEY, getSettings, clone(defaultSettings));
}

export function useLanguage() {
  return subscribeKey<Language>(LANGUAGE_KEY, getLanguage, "fr");
}

export function initializeStore() {
  if (typeof window === "undefined") return;
  const storedVersion = window.localStorage.getItem(CATALOG_VERSION_KEY);

  if (storedVersion !== CATALOG_VERSION) {
    writeStorage(MENU_KEY, touchMenu(clone(defaultMenu)));
    writeStorage(SETTINGS_KEY, clone(defaultSettings));
    writeStorage(LANGUAGE_KEY, "fr");
    window.localStorage.setItem(CATALOG_VERSION_KEY, CATALOG_VERSION);
    return;
  }

  if (!window.localStorage.getItem(MENU_KEY)) {
    writeStorage(MENU_KEY, touchMenu(clone(defaultMenu)));
  }
  if (!window.localStorage.getItem(SETTINGS_KEY)) {
    writeStorage(SETTINGS_KEY, clone(defaultSettings));
  }
  if (!window.localStorage.getItem(LANGUAGE_KEY)) {
    writeStorage(LANGUAGE_KEY, "fr");
  }
}
