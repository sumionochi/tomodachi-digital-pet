//page.tsx
"use client"

import { useState, useEffect } from "react"
import {
  ConnectButton,
  useCurrentAccount,
  useSuiClient,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  mintAsset,
  createPet,
  checkIn,
  createUser,
  equipAsset,
  unequipAsset,
  LAST_CHECKIN_ID,
  WALRUS_BASE,
  adminSetScore,
} from "@/lib/sui"
import {
  useScoreboard,
  usePets,
  useAssets,
  useEquippedAssets,
  useAdminCap,
} from "@/hooks/gameHooks"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useLastCheckIn } from "@/hooks/gameHooks";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { useRef } from "react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, DownloadIcon, Trash, TrashIcon } from "lucide-react";
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { toast } from "sonner"
import AttributeInputList from "@/components/AttributeInputList";
import { quiz as allQuizzes } from "@/components/DailyQuiz"

const Bars3Icon = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export default function HomePage() {
  const lastCheckInID = LAST_CHECKIN_ID;

  const suiClient = useSuiClient()
  const account = useCurrentAccount()
  const address = account?.address
  const { mutate: signAndExecute } = useSignAndExecuteTransaction()
  const { lastCheckIn, refresh: refreshLastCheckIn } = useLastCheckIn(address, lastCheckInID);
  const [now, setNow] = useState(Date.now() / 1000);

  const [uploadedPreviews, setUploadedPreviews] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now() / 1000), 60 * 1000); // update every minute
    return () => clearInterval(interval);
  }, []);

  const canCheckIn =
    !lastCheckIn || now - lastCheckIn >= 86400;

  const { score, isRegistered, refresh: refreshScore } = useScoreboard(address)
  const { pets, refresh: refreshPets } = usePets(address)
  const { assets, refresh: refreshAssets } = useAssets(address)
  const { equippedAssets, refresh: refreshEquipped } = useEquippedAssets(address)
  const { isAdmin } = useAdminCap(address)
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

 // creation state
  const [petName, setPetName] = useState("")
  const [creationType, setCreationType] = useState<"pet"|"asset">("pet")  
  const [mintingAsset, setMintingAsset] = useState(false)
  const [equipping, setEquipping] = useState(false)
  const [selectedPet, setSelectedPet] = useState<string | null>(null)
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
  const [adminUser, setAdminUser] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"home"|"dailyQuiz"|"pets"|"assets"|"more">("home")

  const [prompt, setPrompt] = useState<string>('');
  const [generatedB64, setGeneratedB64] = useState<string | null>(null);
  const [metaName, setMetaName] = useState<string>('');
  const [metaDescription, setMetaDescription] = useState<string>('');
  const [attributeList, setAttributeList] = useState<{ key: string; value: string }[]>([]);
  const [actionValue, setActionValue] = useState<number>(0);
  const [framesValue, setFramesValue] = useState<number>(1);
  const [introOpen, setIntroOpen] = useState(true);
  const [generatedUrls, setGeneratedUrls] = useState<string[]>([])

  const [mode, setMode] = useState<"prompt" | "sketch">("prompt");
  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  const [adminSetUser, setAdminSetUser] = useState("");
  const [adminSetScoreValue, setAdminSetScoreValue] = useState<number>(0);
  const [settingScore, setSettingScore] = useState(false);

  const [sizeOption, setSizeOption] = useState<"1024x1024"|"1024x1536"|"1536x1024"|"auto">("1024x1024")
  const [qualityOption, setQualityOption] = useState<"low"|"medium"|"high"|"auto">("auto")
  const [backgroundOption, setBackgroundOption] = useState<"transparent"|"opaque">("transparent")
  const [numImages, setNumImages] = useState(1)
  const [moderationLevel, setModerationLevel] = useState<"auto"|"low">("auto")
  const [previewUrl, setPreviewUrl]     = useState<string | null>(null);

  const [selectedPreviews, setSelectedPreviews] = useState<string[]>([]);
  const [maskMode, setMaskMode] = useState(false);
  const maskRef = useRef<ReactSketchCanvasRef>(null);
  const [editPrompt, setEditPrompt] = useState<string>("");
  const [imgSize, setImgSize] = useState<{ width: number; height: number }>(
    sizeOption === "auto"
      ? { width: 1024, height: 1024 }
      : (() => {
          const [w, h] = sizeOption.split("x").map(Number);
          return { width: w, height: h };
        })()
  );

  const [todayQuiz, setTodayQuiz] = useState(() => getRandomQuizzes(allQuizzes, 3));
  const [quizAnswers, setQuizAnswers] = useState<(string | null)[]>([null, null, null])
  const [quizDone, setQuizDone] = useState(false);

  const equippedAssetIds = new Set(
    Object.values(equippedAssets).flat()
  );

  useEffect(() => {
    if (maskMode) {
      maskRef.current?.eraseMode(true);
    }
  }, [maskMode]);
  
  useEffect(() => {
    if (sizeOption === "auto") return;
    const [w, h] = sizeOption.split("x").map(Number);
    setImgSize({ width: w, height: h });
  }, [sizeOption]);

  useEffect(() => {
    if (canCheckIn) {
      setTodayQuiz(getRandomQuizzes(allQuizzes, 3));
      setQuizAnswers([null, null, null]);
      setQuizDone(false);
    }
  }, [canCheckIn]);
  
  const queryClient = useQueryClient();

  const TABS: { key: Tab; label: string }[] = [
    { key: "home",  label: "Home" },
    { key: "dailyQuiz", label: "Daily Quiz" },
    { key: "pets",  label: "Pets" },
    { key: "assets",label: "Assets" },
    { key: "more",  label: "More" },
  ]
  
  type Tab = "home" | "dailyQuiz" | "pets" | "assets" | "more"

  useEffect(() => {
    // Refresh data when account changes
    if (address) {
      refreshScore();
      refreshPets();
      refreshAssets();
      refreshEquipped();
    }
  }, [address]);

  // Get the previews from the query cache
  const { data: previews = [] } = useQuery<string[]>({
    queryKey: ["draft_previews"],
    queryFn: () => [],
    staleTime: Infinity,
    enabled: true,
  })

  // Generation mutation to add new previews
  const generateMutation = useMutation<string[], Error, void>({
    mutationFn: async () => {
      const res = await fetch("/api/generatePetPreview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          size: sizeOption,
          quality: qualityOption,
          background: backgroundOption,
          n: numImages,
          moderation: moderationLevel,
        }),
      });
      const { urls } = await res.json();
      return urls;
    },
    onSuccess(newUrls) {
      // always add to your draft cache
      toast.success("Generated Successfully!");
      queryClient.setQueryData<string[]>(
        ["draft_previews"],
        (old = []) => [...old, ...newUrls]
      );
  
      // **if there’s exactly one** result, auto-select it as your final preview
      if (newUrls.length === 1) {
        setPreviewUrl(newUrls[0]);       // show this straight away
        setSelectedPreviews([]);         // clear any prior multi-select
      }
    },
  });

  // Multi-image refine mutation
  const refineMutation = useMutation<string, Error, { images: string[]; prompt: string }>(
    {
      mutationFn: async ({ images, prompt }) => {
        if (images.length === 0) {
          throw new Error("No previews selected");
        }
        const res = await fetch("/api/editPetPreview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            images,               // <-- array of preview URLs / base64 strings
            prompt,               // refinement instructions
            size: sizeOption,
            quality: qualityOption,
            background: backgroundOption,
            moderation: moderationLevel,
          }),
        });
        const { url } = await res.json();
        return url;           // your combined/refined asset URL
      },
      onSuccess: (newUrl) => {
        // Add the new combined asset to your cache
        toast.success("Refined Successfully!");
        queryClient.setQueryData<string[]>(
          ["draft_previews"],
          (old = []) => [...old, newUrl]
        );
        // reset selection
        setSelectedPreviews([]);
        // optionally set this as your final preview
        setSelectedPreviews([]);         // clear the array
        setPreviewUrl(newUrl);           // save the combined result
      },
    }
  );

  // Upload sketch mutation
  const uploadSketchMutation = useMutation<string, Error, string>({
    mutationFn: async (b64) => {
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ b64 }),
      });
      const { blobId } = await uploadRes.json();
      return `${process.env.NEXT_PUBLIC_WALRUS_BASE_URL}/${blobId}`;
    },
    onSuccess(url) {
      queryClient.setQueryData<string[]>(
        ["draft_previews"],
        (old = []) => [...old, url]
      )
      setSelectedPreviews([]);         // clear any multi-selection
      setPreviewUrl(url);              // record this single preview
    },
  })

  const mintMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      const attributesJson = JSON.stringify(
        attributeList.filter(a => a.key.trim()).reduce((acc, a) => {
          acc[a.key] = a.value;
          return acc;
        }, {} as Record<string, string>)
      );
      console.log("🍃 [mintMutation] start", {
        address,
        previewUrl,
        actionValue,
        framesValue,
        metaName,
        metaDescription,
        attributesJson,
      });
  
      if (!address || !previewUrl) {
        console.error("⚠️ [mintMutation] Missing input", { address, previewUrl });
        throw new Error("Missing address or preview URL");
      }
  
      // 1) Upload to Walrus if we have a data URL
      let urlToMint = previewUrl;
      if (previewUrl.startsWith("data:")) {
        console.log("🦭 [mintMutation] Uploading Base64 to Walrus…");
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ b64: previewUrl.split(",")[1] }),
        });
  
        console.log("🦭 [mintMutation] Walrus responded:", uploadRes.status);
        let uploadBody: any;
        try {
          uploadBody = await uploadRes.json();
          console.log("🦭 [mintMutation] upload JSON body:", uploadBody);
        } catch (e) {
          console.error("🦭 [mintMutation] failed to parse Walrus response", e);
          throw new Error("Failed to parse Walrus response");
        }
  
        if (!uploadRes.ok) {
          console.error("🦭 [mintMutation] Walrus upload failed", uploadBody);
          throw new Error(`Walrus upload failed: ${JSON.stringify(uploadBody)}`);
        }
  
        const { blobId } = uploadBody;
        if (!blobId) {
          console.error("🦭 [mintMutation] No blobId in Walrus response", uploadBody);
          throw new Error("Walrus upload returned no blobId");
        }
  
        urlToMint = `${process.env.NEXT_PUBLIC_WALRUS_BASE_URL}/v1/blobs/${blobId}`;
        console.log("🦭 [mintMutation] urlToMint set to", urlToMint);
      } else {
        console.log("🔗 [mintMutation] previewUrl is already a URL:", previewUrl);
      }
  
      // 2) Mint on-chain
      console.log("⛓️ [mintMutation] calling mintAsset with", urlToMint);
      const result = await mintAsset(
        address,
        suiClient,
        signAndExecuteTransaction,
        actionValue,
        framesValue,
        urlToMint,
        metaName,
        metaDescription,
        attributesJson
      );
      
      console.log("📬 [mintMutation] mintAsset result:", result);
    },
  
    onSuccess: async () => {
      console.log("🚀 [mintMutation] onSuccess, refreshing assets…");
      await refreshAssets();
      await refreshScore();
      await refreshLastCheckIn();
      console.log("🔄 [mintMutation] assets refreshed, clearing form state…");
      setPreviewUrl(null);
      setMetaName("");
      setMetaDescription("");
      setAttributeList([]);
      setActionValue(0);
      setFramesValue(1);
      queryClient.setQueryData<string[]>(["draft_previews"], []);
      console.log("🏁 [mintMutation] done");
      toast.success("Minting was successful!");
    },
  
    onError: (err) => {
      console.error("❌ [mintMutation] error", err);
      alert("Mint failed: " + err.message);
    },
  });  

  // Handlers
  const handleExportSketch = async () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = await canvasRef.current.exportImage("png");
      const b64 = dataUrl.split(",")[1];
      setGeneratedB64(b64);
      uploadSketchMutation.mutate(b64);
    } catch (e) {
      console.error("Sketch export failed:", e);
    }
  };

  const handleRegister = async () => {
    if (!address) return;
    setLoading(true);
    try {
      await createUser(address, suiClient, (args: any, opts: any) =>
        signAndExecute(args, {
          ...opts,
          onSuccess: async (result: any) => {
            await refreshScore();
            await refreshAssets();
            await refreshLastCheckIn();
            toast.success("Registrated successfully!");
            if (opts?.onSuccess) opts.onSuccess(result);
          },
          onError: opts?.onError,
        })
      );
    } catch (error: unknown) {
      console.error("Register error:", error);
      if (error instanceof Error) {
        alert("Registration failed: " + error.message);
      } else {
        alert("Registration failed: " + String(error));
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleCheckIn = async () => {
    if (!address) return;
    setLoading(true);
    try {
      await checkIn(address, suiClient, (args: any, opts: any) =>
        signAndExecute(args, {
          ...opts,
          onSuccess: async (result: any) => {
            await refreshScore();
            await refreshLastCheckIn();
            toast.success("Score set successfully!");
            if (opts?.onSuccess) opts.onSuccess(result);
          },
          onError: opts?.onError,
        })
      );
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreatePet = async () => {
    if (!address || !petName) return;
    setLoading(true);
    try {
      await createPet(address, suiClient, (args: any, opts: any) =>
        signAndExecute(args, {
          ...opts,
          onSuccess: async (result: any) => {
            setPetName("");
            await refreshPets();
            await refreshScore();
            await refreshLastCheckIn();
            toast.success("Pet minted successfully!");
            if (opts?.onSuccess) opts.onSuccess(result);
          },
          onError: opts?.onError,
        }),
        petName
      );
    } catch (e) {
      console.error("[handleCreatePet] error creating pet:", e);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEquip = async () => {
    if (!address || !selectedPet || !selectedAsset) return;
    setEquipping(true);
    try {
      await equipAsset(address, suiClient, (args: any, opts: any) =>
        signAndExecute(args, {
          ...opts,
          onSuccess: async (result: any) => {
            await refreshEquipped();
            await refreshAssets();
            await refreshPets();
            toast.success("Asset equipped successfully!");
            if (opts?.onSuccess) opts.onSuccess(result);
          },
          onError: opts?.onError,
        }),
        selectedPet,
        selectedAsset
      );
    } catch (e: any) {
      toast.error("Failed to equip asset: " + (e?.message || String(e)));
    } finally {
      setEquipping(false);
    }
  };
  
  const handleUnequip = async (petId: string, assetId: string) => {
    if (!address) return;
    setEquipping(true);
    try {
      await unequipAsset(address, suiClient, (args: any, opts: any) =>
        signAndExecute(args, {
          ...opts,
          onSuccess: async (result: any) => {
            await refreshEquipped();
            await refreshAssets();
            await refreshPets();
            toast.success("Asset unequipped successfully!");
            if (opts?.onSuccess) opts.onSuccess(result);
          },
          onError: opts?.onError,
        }),
        petId,
        assetId
      );
    } catch (e: any) {
      toast.error("Failed to unequip asset: " + (e?.message || String(e)));
    } finally {
      setEquipping(false);
    }
  };
  
  const handleAdminSetScore = async () => {
    if (!address || !adminSetUser) return;
    setSettingScore(true);
    try {
      await adminSetScore(address, suiClient, (args: any, opts: any) =>
        signAndExecute(args, {
          ...opts,
          onSuccess: async (result: any) => {
            setAdminSetUser("");
            setAdminSetScoreValue(0);
            await refreshScore();
            toast.success("Score set successfully!");
            if (opts?.onSuccess) opts.onSuccess(result);
          },
          onError: opts?.onError,
        }),
        adminSetUser,
        adminSetScoreValue
      );
    } catch (e: any) {
      toast.error("Failed to set score: " + (e?.message || String(e)));
    } finally {
      setSettingScore(false);
    }
  };

  function getRandomQuizzes(qArr: typeof allQuizzes, n: number) {
    // Fisher–Yates shuffle, then slice
    const arr = [...qArr]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr.slice(0, n)
  }

  if (!account) {
    return (
      <main className="flex items-center justify-center h-full w-full p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center flex flex-col gap-4 items-center justify-center">
            <h1 className="text-2xl font-bold">Welcome to Tomodachi Pets</h1>
            <CardDescription>
              Adopt your virtual pet on the Sui blockchain. Interact, earn points, and customize your companion.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4 cursor-pointer">
            <ConnectButton className="w-full cursor-pointer" />
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-background border-b">
        <div className="container mx-auto max-w-6xl flex items-center justify-between p-4">
          {/* Logo / Title */}
          <Link href="/">
            <h1 className="text-2xl font-bold">Tomodachi Pets</h1>  
          </Link>

          {/* Large-screen tabs */}
          <div className="hidden md:flex space-x-4">
            {TABS.map(({ key, label }) => (
              <Button
                key={key}
                onClick={() => setActiveTab(key)}
                className={cn(
                  "px-3 py-1 rounded-md font-medium border cursor-pointer",
                  activeTab === key
                    ? "bg-secondary text-secondary-foreground hover:bg-primary/30"
                    : "hover:bg-primary/90"
                )}
              >
                {label}
              </Button>
            ))}
          </div>

          {/* Mobile menu */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="md:hidden p-2 rounded hover:bg-primary/10">
                <Bars3Icon size={20} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-40 flex flex-col gap-4">
              {TABS.map(({ key, label }) => (
                <Button
                  key={key}
                  onClick={() => {
                    setActiveTab(key)
                  }}
                  className={cn(
                    "w-full text-left px-2 py-1 rounded-md font-medium border cursor-pointer",
                    activeTab === key
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-primary/10"
                  )}
                >
                  {label}
                </Button>
              ))}
            </PopoverContent>
          </Popover>

          {/* Spacer */}
          <div className="flex-1 md:hidden" />

          {/* Score & Check-In/Register */}
          <div className="hidden sm:flex items-center space-x-4">
            <div>
              <span className="text-sm">Points:</span>{" "}
              <span className="font-mono">{score ?? 0}</span>
            </div>
            {isRegistered ? (
              <div>
                <Button
                  size="default"
                  onClick={handleCheckIn}
                  disabled={loading || !canCheckIn}
                  className="cursor-pointer"
                >
                  {canCheckIn ? "Daily Check-In" : `Check in ${Math.ceil((lastCheckIn + 86400 - now) / 3600)} hours`}
                </Button>
              </div>
            ) : (
              <Button
                size="default"
                onClick={handleRegister}
                disabled={loading}
                className="cursor-pointer"
              >
                Register
              </Button>
            )}
          </div>

          {/* Wallet */}
          <div className="ml-4 cursor-pointer">
            <ConnectButton className="cursor-pointer" />
          </div>
        </div>
      </nav>

      {/* Mobile score display & actions */}
      <div className="sm:hidden p-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm">Score:</span>{" "}
            <span className="font-mono">{score ?? 0}</span>
          </div>
          {isRegistered ? (
            <div>
            <Button
              size="default"
              onClick={handleCheckIn}
              disabled={loading || !canCheckIn}
              className="cursor-pointer"
            >
              {canCheckIn ? "Daily Check-In" : `Check in ${Math.ceil((lastCheckIn + 86400 - now) / 3600)} hours`}
            </Button>
          </div>
          ) : (
            <Button
              size="sm"
              onClick={handleRegister}
              disabled={loading}
            >
              Register
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto max-w-6xl p-4 mt-4 flex-1 space-y-8">
        {activeTab === "home" && (
          <div>
            <Collapsible open={introOpen} onOpenChange={setIntroOpen}>
  <CollapsibleTrigger asChild>
    <Card className="cursor-pointer flex flex-row justify-between items-center">
      <CardHeader className="w-full">
        <h1 className="text-2xl font-bold">
          Welcome to Tomodachi Pets: A Digital Pet Game & Browser Companion
        </h1>
        <CardDescription>
          Your AI-powered, on-chain virtual pet playground — now with Daily Quizzes and a live browser pet extension!
        </CardDescription>
      </CardHeader>
      <div className="pr-4">
        {introOpen ? (
          <ChevronDown size={24} />
        ) : (
          <ChevronRight size={24} />
        )}
      </div>
    </Card>
  </CollapsibleTrigger>

  <AnimatePresence initial={false}>
    {introOpen && (
      <motion.div
        key="intro"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <CollapsibleContent forceMount>
          <Card className="mt-4">
            <CardContent>
              <p className="mb-4">
                Tomodachi Pets lets you <strong>draw or prompt</strong> custom pet accessories, mint them as NFTs on Sui,
                and <strong>bundle</strong> them onto your digital pet — all with full on-chain composability. <br />
                <span className="text-blue-700 font-semibold">
                  Now featuring Daily Quizzes and a Chrome Extension: keep your pet and its assets following your cursor as you browse!
                </span>
              </p>

              <h3 className="text-lg font-medium mb-2">How It Works</h3>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>
                  <strong>Sketch or Type</strong> — draw an accessory, or give a text prompt (e.g. "Ghibli fluffy cat")
                </li>
                <li>
                  <strong>AI-Gen Service</strong> — uses GPT-Image-1 to generate a transparent PNG
                </li>
                <li>
                  <strong>Walrus Storage</strong> — stores your image, returns a URL
                </li>
                <li>
                  <strong>Mint Accessory</strong> — spend points to mint that image as an Asset NFT
                </li>
                <li>
                  <strong>Create & Customize Pet</strong> — mint your pet, equip/unequip assets dynamically
                </li>
              </ol>

              <h3 className="text-lg font-medium mb-2">Daily Quiz: Learn & Earn</h3>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>
                  <strong>Test Your Knowledge:</strong> Every day, answer 3 fresh quizzes to unlock your daily reward.
                </li>
                <li>
                  <strong>Required for Check-In:</strong> Complete the daily quiz to enable your Daily Check-In and +2 claim points!
                </li>
                <li>
                  <strong>Quizzes Refresh Daily:</strong> Each day brings new, random questions so you can keep learning and earning.
                </li>
              </ul>

              <h3 className="text-lg font-medium mb-2">Browser Extension: Your Pet Follows You!</h3>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>
                  <strong>Live Pet Cursor:</strong> Your pet and selected assets orbit your cursor on any website!
                </li>
                <li>
                  <strong>Fully Customizable:</strong> Choose which assets to display, including static and animated accessories.
                </li>
                <li>
                  <strong>Frame-by-Frame Animation:</strong> Animated assets (spritesheets) play smoothly at 4 frames per second.
                </li>
                <li>
                  <strong>User Control:</strong> Toggle visibility, asset rotation, and animation speed directly from the extension popup.
                </li>
              </ul>

              <h3 className="text-lg font-medium mb-2">Game Loop & Rewards</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>📅 <strong>Daily Quiz + Check-In:</strong> Complete your daily quiz and check-in to earn points every day</li>
                <li>🏆 <strong>Spend Points:</strong> Mint unique accessories (10 pts each)</li>
                <li>🎨 <strong>Express Yourself:</strong> Build a one-of-a-kind pet with your own designs</li>
                <li>🔄 <strong>Composable NFTs:</strong> Equip, unequip, or swap assets anytime</li>
              </ul>

              <p className="mt-4 text-sm text-muted-foreground">
                All images and metadata are fully on-chain and stored in Walrus, giving you true ownership, composability, and a playground for creativity. Try the browser extension and daily quizzes for a uniquely interactive experience!
              </p>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </motion.div>
    )}
  </AnimatePresence>
            </Collapsible>


             <div className="flex w-full rounded-md border bg-muted mt-8">
                <Button
                  variant={creationType === "pet" ? "default" : "outline"}
                  onClick={() => setCreationType("pet")}
                  className="flex-1 rounded-none rounded-l-md cursor-pointer"
                >
                  Create Pet
                </Button>
                <Button
                  variant={creationType === "asset" ? "default" : "outline"}
                  onClick={() => setCreationType("asset")}
                  className="flex-1 rounded-none rounded-r-md cursor-pointer"
                >
                  Create Accessory
                </Button>
              </div>

            {creationType === "pet" ? (
            <Card className="mt-8">
              <CardHeader><h2>Create a New Pet</h2></CardHeader>
              <CardContent className="flex space-x-2">
                <Input placeholder="Pet name" value={petName} onChange={e=>setPetName(e.target.value)}/>
                <Button onClick={handleCreatePet} className="cursor-pointer">Create Pet</Button>
              </CardContent>
            </Card>
            ) : (
              <div>
                {/* ── 1) Prompt/Sketch & Submit ── */}
                <div className="space-y-4 mt-8">
                  <h1 className="text-2xl font-bold">Create your Ideal Pet Companion/Tomodachi</h1>
                  {/* Mode Toggle */}
                  <div className="flex space-x-2">
                    <Button
                      variant={mode === "prompt" ? "default" : "outline"}
                      onClick={() => setMode("prompt")}
                      className="cursor-pointer"
                    >
                      Prompt
                    </Button>
                    <Button
                      variant={mode === "sketch" ? "default" : "outline"}
                      onClick={() => setMode("sketch")}
                      disabled={true}
                      className="cursor-pointer"
                    >
                      Sketch (Coming Soon)
                    </Button>
                  </div>

                  <div className="mt-4">
                    <Label className="inline-block cursor-pointer text-sm text-primary underline">
                      Upload your own image
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            const dataUrl = reader.result as string;
                            // add to local uploaded state
                            setUploadedPreviews((u) => [dataUrl, ...u]);
                            // also add to your react-query cache so the rest of the pipeline just works
                            queryClient.setQueryData<string[]>(
                              ["draft_previews"],
                              (old = []) => [dataUrl, ...old]
                            );
                            // you can optionally auto-select the first upload as final:
                            setPreviewUrl(dataUrl);
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </Label>
                  </div>

                  {/* Prompt Input or Sketch Canvas */}
                  {mode === "prompt" ? (
                    <Input
                      placeholder="Describe your asset"
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                    />
                  ) : (
                    <ReactSketchCanvas
                      ref={canvasRef}
                      width="512px"
                      height="512px"
                      strokeWidth={4}
                      className="border rounded"
                    />
                  )}

                  {/* Submit Button */}
                  <Button
                    onClick={mode === "prompt" ? () => generateMutation.mutate() : handleExportSketch}
                    disabled={generateMutation.isPending || uploadSketchMutation.isPending || (mode === "prompt" && !prompt)}
                  >
                    {mode === "prompt" ? 
                      (generateMutation.isPending ? "Generating..." : "Generate Preview") : 
                      (uploadSketchMutation.isPending ? "Uploading..." : "Submit Sketch")}
                  </Button>
                </div>

                {/* ── 2) GPT-Image-1 Options & Previews ── */}
                <div className="space-y-4 mt-8">
                  <h1 className="text-2xl font-bold">Preview Settings</h1>
                  {/* Options Selectors */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div>
                      <Label className="mb-1" htmlFor="size-select">Size</Label>
                      <Select
                        value={sizeOption}
                        onValueChange={v =>
                          setSizeOption(v as "1024x1024" | "1024x1536" | "1536x1024" | "auto")
                        }
                      >
                        <SelectTrigger id="size-select">
                          <SelectValue placeholder="Size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1024x1024">1024×1024</SelectItem>
                          <SelectItem value="1024x1536">1024×1536</SelectItem>
                          <SelectItem value="1536x1024">1536×1024</SelectItem>
                          <SelectItem value="auto">auto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="mb-1" htmlFor="quality-select">Quality</Label>
                      <Select
                        value={qualityOption}
                        onValueChange={v =>
                          setQualityOption(v as "low" | "medium" | "high" | "auto")
                        }
                      >
                        <SelectTrigger id="quality-select">
                          <SelectValue placeholder="Quality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">low</SelectItem>
                          <SelectItem value="medium">medium</SelectItem>
                          <SelectItem value="high">high</SelectItem>
                          <SelectItem value="auto">auto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="mb-1" htmlFor="background-select">Background</Label>
                      <Select
                        value={backgroundOption}
                        onValueChange={v =>
                          setBackgroundOption(v as "transparent" | "opaque")
                        }
                      >
                        <SelectTrigger id="background-select">
                          <SelectValue placeholder="Background" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="transparent">transparent</SelectItem>
                          <SelectItem value="opaque">opaque</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="mb-1" htmlFor="count-input">Quantity</Label>
                      <Input
                        id="count-input"
                        type="number"
                        min={1}
                        max={4}
                        value={numImages}
                        onChange={e => setNumImages(+e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="mb-1" htmlFor="moderation-select">Moderation</Label>
                      <Select
                        value={moderationLevel}
                        onValueChange={v => setModerationLevel(v as "auto" | "low")}
                      >
                        <SelectTrigger id="moderation-select">
                          <SelectValue placeholder="Moderation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">auto</SelectItem>
                          <SelectItem value="low">low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* ── 3) GPT-Image-1 Previews & Minting ── */}
                <div className="space-y-4 mt-8">
                  {/* Grid of all previews */}
                  {previews.filter(Boolean).length > 0 && (
                    <div className="flex flex-col space-y-4">
                      <h1 className="text-2xl font-bold">Previews</h1>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {previews
                        .filter((url) => typeof url === "string" && url.length > 0)
                        .map((url, idx) => {
                        const refining = selectedPreviews.includes(url)
                        const isFinal  = previewUrl === url

                        return (
                          <div key={idx} className="relative group">
                            <img
                              src={url}
                              alt={`Preview ${idx + 1}`}
                              className={`w-full h-auto rounded border transition ${
                                isFinal  ? "ring-2 ring-primary" : ""
                              }`}
                            />

                            {/* overlay buttons on hover */}
                            <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center space-y-2">
                              <Button
                                size="sm"
                                onClick={() =>
                                  setSelectedPreviews(prev =>
                                    refining
                                      ? prev.filter(u => u !== url)
                                      : [...prev, url]
                                  )
                                }
                              >
                                {refining ? "Unselect refine" : "Select refine"}
                              </Button>

                              <Button
                                size="sm"
                                onClick={() =>
                                  setPreviewUrl(prev => (prev === url ? null : url))
                                }
                              >
                                {isFinal ? "Unselect final" : "Select final"}
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                      </div>
                    </div>
                  )}

                  {/* Refinement UI */}
                  {selectedPreviews.length > 0 && (
                    <div className="mt-4 mb-4 space-y-2">
                      <Input
                        placeholder="Refinement instructions"
                        value={editPrompt}
                        onChange={e => setEditPrompt(e.target.value)}
                      />
                      <Button
                        onClick={() =>
                          refineMutation.mutate({ images: selectedPreviews, prompt: editPrompt })
                        }
                        disabled={!editPrompt || refineMutation.status === "pending"}
                        className="mt-2"
                      >
                        {refineMutation.status === "pending" ? "Refining…" : `Apply Refine for ${selectedPreviews.length}`}
                      </Button>
                    </div>
                  )}

                  {/* Final Mint Form */}
                  {previewUrl && (
                    <div className="w-full mx-auto">
                      <h1 className="text-2xl text-start font-bold mt-8">Final Preview & Mint</h1>
                      <Card className="mt-4 w-full max-w-sm rounded-md">
                        <CardContent className="space-y-4">
                          <div className="w-full">
                            <img
                              src={previewUrl}
                              alt="Selected Preview"
                              className="w-full h-auto rounded border"
                            />
                          </div>

                          <div className="space-y-4">
                            <Input
                              placeholder="Asset Name"
                              value={metaName}
                              onChange={e => setMetaName(e.target.value)}
                            />
                            <Input
                              placeholder="Description"
                              value={metaDescription}
                              onChange={e => setMetaDescription(e.target.value)}
                            />
                            <Label className="block text-sm font-medium text-muted-foreground">
                              Attributes
                            </Label>
                            <AttributeInputList
                              attributes={attributeList}
                              onChange={setAttributeList}
                            />

                          </div>

                          <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                            <div className="flex flex-col">
                            <Label className="block text-sm font-medium text-muted-foreground">
                              Asset No.
                            </Label>
                            <Input
                              type="number"
                              min={0}
                              placeholder="action"
                              value={actionValue}
                              onChange={e => setActionValue(+e.target.value)}
                              className="flex-1"
                            />
                            </div>
                            <div className="flex flex-col">
                            <Label className="block text-sm font-medium text-muted-foreground">
                              Frames
                            </Label>
                            <Input
                              type="number"
                              min={1}
                              placeholder="frames"
                              value={framesValue}
                              onChange={e => setFramesValue(+e.target.value)}
                              className="flex-1"
                            />
                            </div>
                          </div>

                          <Button
                            onClick={() => mintMutation.mutate()}
                            disabled={mintMutation.status === "pending" || !metaName || (score ?? 0) < 10}
                            className="w-full cursor-pointer"
                          >
                            {mintMutation.status === "pending"
                              ? "Minting…"
                              : "Mint Asset (10 pts)"}
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            )}      
          </div>
        )}

        {activeTab === "dailyQuiz" && (
          <Card>
            <CardHeader>
              <h1 className="text-2xl font-bold">Daily Quiz</h1>
              <CardDescription>
                Answer today’s quizzes to unlock your daily check-in reward!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {(!canCheckIn) && (
                <div className="p-3 rounded bg-muted text-muted-foreground">
                  Daily quiz will be available after {Math.ceil((lastCheckIn + 86400 - now) / 3600)} hours.
                </div>
              )}
              {canCheckIn && todayQuiz.map((q, idx) => (
                <div key={idx} className="mb-4 p-3 border rounded bg-accent/10">
                  <div className="font-medium mb-2">{`Q${idx + 1}: ${q.question}`}</div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(q.options).map(([opt, label]) => (
                      <Button
                        key={opt}
                        size="sm"
                        variant={quizAnswers[idx] === opt ? "default" : "outline"}
                        className="w-full"
                        disabled={quizDone}
                        onClick={() => {
                          const updated = [...quizAnswers];
                          updated[idx] = opt;
                          setQuizAnswers(updated);
                          // If all answered, mark as done:
                          if (updated.every(a => a !== null)) setQuizDone(true);
                        }}
                      >
                        {opt}: {label}
                      </Button>
                    ))}
                  </div>
                  {quizDone && (
                    <div className="mt-2 text-xs">
                      {quizAnswers[idx] === q.answer ? (
                        <span className="text-green-700">Correct!</span>
                      ) : (
                        <span className="text-red-700">
                          Wrong (correct: {q.answer}: {q.options[q.answer]})
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Only show check-in button if all quiz answered and canCheckIn */}
              <Button
                size="lg"
                className="w-full"
                onClick={handleCheckIn}
                disabled={
                  !canCheckIn ||
                  !quizDone ||
                  quizAnswers.some(a => a === null) ||
                  loading
                }
              >
                {loading ? "Claiming…" : "Claim Daily Reward"}
              </Button>
            </CardContent>
          </Card>
        )}


        {activeTab === "pets" && (
          <Card>
            <CardHeader>
              <h1 className="text-2xl font-bold">Your Pets</h1>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pets.length>0 ? pets.map(pet=>(
                  <Card key={pet.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-col space-y-1">
                      <h2 className="text-xl font-semibold">{pet.name}</h2>
                      <p className="text-xs text-muted-foreground break-all">ID: {pet.id}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <h3 className="font-medium">Equipped Assets</h3>
                      {(equippedAssets[pet.id] ?? []).map((assetId) => {
                        return (
                          <div key={assetId} className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground break-all">Asset ID: {assetId}</span>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleUnequip(pet.id, assetId)}
                              disabled={equipping}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}

                      <Button
                        size="sm"
                        variant={selectedPet === pet.id ? "default" : "outline"}
                        onClick={() =>
                          setSelectedPet(prev => (prev === pet.id ? null : pet.id))
                        }
                        className="w-full"
                      >
                        {selectedPet === pet.id ? "Selected" : "Select Pet"}
                      </Button>
                    </CardContent>
                  </Card>
                )) : (
                  <p className="text-center col-span-full">No pets yet. Create one above!</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "assets" && (
          <Card>
            <CardHeader className="flex flex-col space-y-1">
              <h1 className="text-2xl font-bold">Your Assets</h1>
            </CardHeader>
            <CardContent className="space-y-3">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {assets.length > 0 ? assets.map(asset => {
                const isEquipped = equippedAssetIds.has(asset.id);
                return (
                  <Card key={asset.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-col space-y-1">
                      <h2 className="text-xl font-semibold">{asset.name}</h2>
                      <p className="text-xs text-muted-foreground break-all">ID: {asset.id}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <img
                        src={asset.url}
                        alt={asset.name}
                        className="w-full h-72 object-cover rounded"
                      />
                      <p className="text-sm">{asset.description}</p>
                      {isEquipped && (
                        <span className="inline-block text-xs font-medium text-yellow-600">
                          Equipped
                        </span>
                      )}
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant={isEquipped ? "outline" : (selectedAsset === asset.id ? "default" : "outline")}
                          disabled={isEquipped}
                          onClick={() =>
                            setSelectedAsset(prev => (prev === asset.id ? null : asset.id))
                          }
                          className="flex-1"
                        >
                          {isEquipped
                            ? "Equipped"
                            : (selectedAsset === asset.id ? "Selected" : "Select")}
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={async () => {
                            try {
                              const res = await fetch(asset.url);
                              const blob = await res.blob();
                              const blobUrl = URL.createObjectURL(blob);
                              const link = document.createElement("a");
                              link.href = blobUrl;
                              link.download = `${asset.name.replace(/\s+/g, "_")}.png`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              URL.revokeObjectURL(blobUrl);
                            } catch {
                              toast.error("Download failed");
                            }
                          }}
                          className="px-2 cursor-pointer"
                        >
                          <DownloadIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              }) : (
                <p className="text-center col-span-full">No assets yet. Mint one above!</p>
              )}
              {/* Equip action */}
              {selectedPet && selectedAsset && (
                <div className="col-span-full flex justify-center">
                  <Button onClick={handleEquip} disabled={equipping}>
                    Equip <strong>{assets.find(a => a.id === selectedAsset)?.name}</strong> to <strong>{pets.find(p => p.id === selectedPet)?.name}</strong>
                  </Button>
                </div>
              )}
            </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "more" && (
          <Card>
            <CardHeader>
              <h1 className="text-2xl font-bold">More Options</h1>
            </CardHeader>
            <CardContent className="space-y-4">
              {isAdmin && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Admin Controls</h3>
                  {/* --- New: Set Score --- */}
                  <Input
                    placeholder="User address"
                    value={adminSetUser}
                    onChange={e => setAdminSetUser(e.target.value)}
                  />
                  <Input
                    placeholder="New score"
                    type="number"
                    value={adminSetScoreValue}
                    onChange={e => setAdminSetScoreValue(Number(e.target.value))}
                  />
                  <Button
                    variant="default"
                    onClick={handleAdminSetScore}
                    disabled={settingScore || !adminSetUser}
                  >
                    {settingScore ? "Setting..." : "Set User Score"}
                  </Button>
                </div>
              )}
              <div>
                <h1 className="text-xl pt-4">SuiPet Game: <code className=" italic">game.move</code> Contract Overview</h1>

                <h2 className="mt-4">What is SuiPet?</h2>
                <p>
                  <strong>SuiPet</strong> is a virtual pet platform built on the Sui blockchain. Users can register, earn points, mint unique pets and assets, and customize their digital companions. The <code>game.move</code> contract implements all core game logic, asset management, and admin controls.
                </p>

                <h2 className="mt-4">Core Game Logic</h2>
                <h3 className="mt-2">1. User Registration & Scoreboard</h3>
                <p>
                  New users register via <code>create_user</code>. Each user is added to the global <strong>ScoreBoard</strong> and starts with 100 points. Scores are tracked in a table mapping addresses to scores.
                </p>

                <h3 className="mt-2">2. Daily Check-In</h3>
                <p>
                  Users can check in once every 24 hours using <code>check_in</code>. This increases their score by 2 points and updates their last check-in timestamp. The contract enforces the 24-hour rule using the Sui <strong>Clock</strong> object.
                </p>

                <h3 className="mt-2">3. Minting Assets</h3>
                <p>
                  Users can mint assets (e.g., accessories for pets) by spending points (<code>PRICE_ASSET = 10</code>). Each asset has rich metadata (name, description, attributes, action, frames, and URL). Minted assets are tracked per user, and an event is emitted for each mint.
                </p>

                <h3 className="mt-2">4. Minting Pets</h3>
                <p>
                  Users can mint a unique pet by providing a name. The contract ensures pet names are globally unique using the <strong>PetNames</strong> table. Each pet is an NFT with a unique ID and name.
                </p>

                <h3 className="mt-2">5. Equipping and Unequipping Assets</h3>
                <p>
                  Assets can be equipped to pets, but each asset can only be equipped to one pet at a time (global uniqueness enforced). The contract uses Sui's <strong>dynamic_object_field</strong> to attach assets to pets. Equipping or unequipping emits events and updates the global equipped status.
                </p>

                <h2 className="mt-4">Admin Logic</h2>
                <h3 className="mt-2">AdminCap: The Admin Capability</h3>
                <p>
                  The contract defines an <code>AdminCap</code> object, which is transferred to the contract deployer during initialization. Only the holder of <code>AdminCap</code> can perform privileged admin actions.
                </p>

                <h3 className="mt-2">Admin Functions</h3>
                <h4>Set User Score</h4>
                <p>
                  <code>admin_set_score</code> allows the admin to set or update any user's score directly. This can be used for rewards, penalties, or correcting errors.
                </p>

                <h4>Initialization</h4>
                <p>
                  During <code>init</code>, the contract sets up all global objects (scoreboard, mint records, pet names, equipped assets, last check-in) and transfers the <code>AdminCap</code> and <code>UserMintCap</code> to the deployer. All other objects are shared for global access.
                </p>

                <h2 className="mt-4">Events</h2>
                <p>
                  The contract emits events for minting assets, equipping, and unequipping, enabling off-chain apps to track user actions and asset changes.
                </p>

                <h2 className="mt-4">Security & Error Handling</h2>
                <ul>
                  <li>All critical actions have error codes (e.g., already registered, not enough score, name taken, asset already equipped).</li>
                  <li>Global uniqueness is enforced for pet names and equipped assets.</li>
                  <li>Admin-only functions require the <code>AdminCap</code> object.</li>
                </ul>

                <h2 className="mt-4">Summary</h2>
                <p>
                  The <code>game.move</code> contract provides a robust, extensible foundation for SuiPet, leveraging Sui's object model, dynamic fields, and capability-based admin controls. It ensures fair gameplay, secure asset management, and flexible admin intervention.
                </p>
              </div>

            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-background border-t py-4 mt-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 Tomodachi Pets - A virtual pet simulator on the Sui blockchain</p>
        </div>
      </footer>
    </div>
  )
}