"use client";

import { useEffect, useState } from "react";

const CART_STORAGE_KEY = "tajmahal_public_cart_v1";
const NOTES_STORAGE_KEY = "tajmahal_public_notes_v1";
const CART_EVENT_NAME = "tajmahal-public-cart-updated";

export interface PublicCartState {
  cart: Record<string, number>;
  notes: Record<string, string>;
}

const EMPTY_CART_STATE: PublicCartState = {
  cart: {},
  notes: {},
};

function readRecord(key: string) {
  if (typeof window === "undefined") return {};

  try {
    const value = window.localStorage.getItem(key);
    if (!value) return {};
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function getPublicCartState(): PublicCartState {
  return {
    cart: readRecord(CART_STORAGE_KEY),
    notes: readRecord(NOTES_STORAGE_KEY),
  };
}

function dispatchCartEvent() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CART_EVENT_NAME));
}

export function savePublicCartState(state: PublicCartState) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
  window.localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(state.notes));
  dispatchCartEvent();
}

export function clearPublicCartState() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(CART_STORAGE_KEY);
  window.localStorage.removeItem(NOTES_STORAGE_KEY);
  dispatchCartEvent();
}

export function usePublicCartState() {
  const [state, setState] = useState<PublicCartState>(EMPTY_CART_STATE);

  useEffect(() => {
    const syncState = () => setState(getPublicCartState());

    syncState();
    window.addEventListener("storage", syncState);
    window.addEventListener(CART_EVENT_NAME, syncState);

    return () => {
      window.removeEventListener("storage", syncState);
      window.removeEventListener(CART_EVENT_NAME, syncState);
    };
  }, []);

  return state;
}
